import { TRPCError } from '@trpc/server';
import { and, eq, gt, inArray, isNull, lte, or } from 'drizzle-orm';
import { stopWatching } from '@/lib/modules/googleCalendar';
import { authedProcedure, createTRPCRouter } from '@/server/api/trpc';
import { requireMemberRole } from '@/server/api/utils';
import { club } from '@/server/db/schema/club';
import { eventCollaborations, events } from '@/server/db/schema/events';
import { eventIdSchema } from '../baseSchemas';
import {
  createSchema,
  disableSyncSchema,
  editEventCollaboratorsSchema,
  editSchema,
} from './inputSchemas';

const eventManageRouter = createTRPCRouter({
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
    const { id, ...data } = input;

    await requireMemberRole(ctx.session.user.id, input.clubId, {
      Officer: {
        errorMessage: "Must be an officer of this event's clubs to modify it",
      },
    });

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
  collaborators: authedProcedure
    .input(editEventCollaboratorsSchema)
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.db.query.events.findFirst({
        where: (events) => eq(events.id, input.eventId),
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      await requireMemberRole(ctx.session.user.id, event.clubId, {
        Officer: {
          errorMessage: 'You must be an officer to edit event collaborators',
        },
      });

      // Deleted
      await ctx.db.transaction(async (tx) => {
        if (input.deleted.length) {
          await tx
            .delete(eventCollaborations)
            .where(
              and(
                eq(eventCollaborations.eventId, event.id),
                inArray(eventCollaborations.inviteeClubId, input.deleted),
              ),
            );
        }
        // Modified
        for (const collaborator of input.modified) {
          await tx
            .update(eventCollaborations)
            .set({ role: collaborator.role })
            .where(
              and(
                eq(eventCollaborations.eventId, event.id),
                eq(eventCollaborations.inviteeClubId, collaborator.clubId),
              ),
            );
        }
        // Created
        if (input.created.length) {
          await tx.insert(eventCollaborations).values(
            input.created.map((collaborator) => ({
              eventId: event.id,
              inviterClubId: event.clubId,
              inviteeClubId: collaborator.clubId,
              role: collaborator.role,
              status: 'pending' as const,
            })),
          );
        }
      });

      return { success: true };
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
