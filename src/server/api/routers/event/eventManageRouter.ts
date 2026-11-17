import { TRPCError } from '@trpc/server';
import {
  and,
  count,
  eq,
  exists,
  gt,
  gte,
  inArray,
  isNull,
  lte,
  or,
} from 'drizzle-orm';
import { stopWatching } from '@/lib/modules/googleCalendar';
import {
  authedProcedure,
  createTRPCRouter,
  type Context,
} from '@/server/api/trpc';
import { requireMemberRole } from '@/server/api/utils';
import { club } from '@/server/db/schema/club';
import { eventCollaborations, events } from '@/server/db/schema/events';
import { userMetadataToClubs } from '@/server/db/schema/users';
import { eventIdSchema } from '../baseSchemas';
import {
  byClubIdSchema,
  createSchema,
  disableSyncSchema,
  editSchema,
  eventManagementAccessSchema,
} from './inputSchemas';

type Database = Context['db'];

async function canEditEventAsClub({
  db,
  userId,
  eventId,
  clubId,
}: {
  db: Database;
  userId: string;
  eventId: string;
  clubId: string;
}) {
  const event = await db.query.events.findFirst({
    where: (event) => eq(event.id, eventId),
    columns: { clubId: true },
  });
  if (!event) return false;

  const officerMembership = await db.query.userMetadataToClubs.findFirst({
    where: and(
      eq(userMetadataToClubs.userId, userId),
      eq(userMetadataToClubs.clubId, clubId),
      inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
    ),
    columns: { clubId: true },
  });
  if (!officerMembership) return false;
  if (event.clubId === clubId) return true;

  const collaboration = await db
    .select({ eventId: eventCollaborations.eventId })
    .from(eventCollaborations)
    .where(
      and(
        eq(eventCollaborations.eventId, eventId),
        eq(eventCollaborations.inviterClubId, event.clubId),
        eq(eventCollaborations.inviteeClubId, clubId),
        eq(eventCollaborations.status, 'accepted'),
      ),
    )
    .limit(1);

  return collaboration.length > 0;
}

const eventManageRouter = createTRPCRouter({
  list: authedProcedure.input(byClubIdSchema).query(async ({ input, ctx }) => {
    await requireMemberRole(ctx.session.user.id, input.clubId, {
      Officer: {
        errorMessage: 'Must be an officer of this club to manage its events',
      },
    });

    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 12));
    const now = input.currentTime ?? new Date();
    const acceptedCollaboration = ctx.db
      .select({ eventId: eventCollaborations.eventId })
      .from(eventCollaborations)
      .where(
        and(
          eq(eventCollaborations.eventId, events.id),
          eq(eventCollaborations.inviterClubId, events.clubId),
          eq(eventCollaborations.inviteeClubId, input.clubId),
          eq(eventCollaborations.status, 'accepted'),
        ),
      );
    const conditions = and(
      eq(events.status, 'approved'),
      or(eq(events.clubId, input.clubId), exists(acceptedCollaboration)),
      input.includePast ? undefined : gte(events.endTime, now),
    );

    const [managedEvents, countResult] = await Promise.all([
      ctx.db.query.events.findMany({
        where: conditions,
        orderBy: input.sortByDate ? (event) => [event.startTime] : undefined,
        with: { club: true },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
      ctx.db.select({ value: count() }).from(events).where(conditions),
    ]);

    return {
      events: managedEvents.map((event) => ({
        ...event,
        isCoHosted: event.clubId !== input.clubId,
      })),
      totalCount: countResult[0]?.value ?? 0,
    };
  }),
  canEdit: authedProcedure
    .input(eventManagementAccessSchema)
    .query(({ input, ctx }) =>
      canEditEventAsClub({
        db: ctx.db,
        userId: ctx.session.user.id,
        eventId: input.eventId,
        clubId: input.clubId,
      }),
    ),
  create: authedProcedure
    .input(createSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: {
          errorMessage: 'Must be an officer of this club to add an event to it',
        },
      });

      const res = await ctx.db
        .insert(events)
        .values({ ...input })
        .returning({ id: events.id });
      const newEvent = res[0];
      if (!newEvent)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add event',
        });
      return newEvent.id;
    }),
  update: authedProcedure.input(editSchema).mutation(async ({ input, ctx }) => {
    const { id, clubId, ...data } = input;

    const canEdit = await canEditEventAsClub({
      db: ctx.db,
      userId: ctx.session.user.id,
      eventId: id,
      clubId,
    });
    if (!canEdit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Must be an officer of a host club to modify this event',
      });
    }

    const res = await ctx.db
      .update(events)
      .set({
        name: data.name,
        location: data.location,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        image: data.image,
        updatedAt: new Date(),
      })
      .where(and(eq(events.id, id), eq(events.google, false)))
      .returning({ id: events.id });

    if (res.length === 0) {
      const existing = await ctx.db.query.events.findFirst({
        where: (e) => eq(e.id, id),
      });

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Event not found.',
        });
      }

      if (existing.google) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot edit a Google Calendar event directly.',
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update event.',
      });
    }
    return res[0]?.id;
  }),
  delete: authedProcedure
    .input(eventIdSchema)
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.db.query.events.findFirst({
        where: (e) => eq(e.id, input.eventId),
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      await requireMemberRole(ctx.session.user.id, event.clubId, {
        Officer: {
          errorMessage: "Must be an officer of this event's clubs to delete it",
        },
      });

      await ctx.db
        .update(events)
        .set({ status: 'deleted' })
        .where(eq(events.id, input.eventId));

      return { success: true };
    }),
  disableSync: authedProcedure
    .input(disableSyncSchema)
    .mutation(async ({ input, ctx }) => {
      const clubRecord = await ctx.db.query.club.findFirst({
        where: eq(club.id, input.clubId),
        columns: { calendarId: true },
      });

      if (!clubRecord) throw new TRPCError({ code: 'NOT_FOUND' });

      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: {
          errorMessage: "Must be an officer of this event's clubs to modify it",
        },
      });

      // close webhook
      await stopWatching(input.clubId);

      // delete all synced events
      await ctx.db
        .update(events)
        .set({ status: 'deleted' })
        .where(
          and(
            eq(events.clubId, input.clubId),
            eq(events.google, true),
            clubRecord.calendarId
              ? or(
                  eq(events.calendarId, clubRecord.calendarId),
                  isNull(events.calendarId),
                )
              : undefined,
            input.keepPastEvents ? gt(events.startTime, new Date()) : undefined, // IF indicated, delete only events that have not yet started
          ),
        );

      // Mark kept past events as non-google so they become editable
      if (input.keepPastEvents) {
        await ctx.db
          .update(events)
          .set({ google: false })
          .where(
            and(
              eq(events.clubId, input.clubId),
              eq(events.google, true),
              lte(events.startTime, new Date()),
              clubRecord.calendarId
                ? or(
                    eq(events.calendarId, clubRecord.calendarId),
                    isNull(events.calendarId),
                  )
                : undefined,
            ),
          );
      }

      // remove google calendar info from the club
      await ctx.db
        .update(club)
        .set({
          calendarSyncToken: null,
          calendarId: null,
          calendarName: null,
          calendarGoogleAccountId: null,
        })
        .where(eq(club.id, input.clubId));

      return { success: true };
    }),
});

export default eventManageRouter;
