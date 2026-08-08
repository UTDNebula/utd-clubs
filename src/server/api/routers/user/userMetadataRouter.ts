import { and, count, eq, gt, gte, inArray, lt, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { type personalCats } from '@/common/modules/navigation/categories';
import { auth } from '@/server/auth';
import {
  SelectUserMetadataToClubs,
  SelectUserMetadataWithClubs,
} from '@/server/db/models';
import { admin } from '@/server/db/schema/admin';
import { user as users } from '@/server/db/schema/auth';
import { events } from '@/server/db/schema/events';
import {
  userMetadata,
  userMetadataToClubs,
  userMetadataToEvents,
} from '@/server/db/schema/users';
import { createTRPCRouter, authedProcedure, publicProcedure } from '@/server/api/trpc';
import {
  byIdSchema,
  eventsSortSchema,
  getByRangeSchema,
  joinedClubEventsSchema,
  updateByIdSchema,
} from './schemas';

const userMetadataRouter = createTRPCRouter({
  byId: authedProcedure
    .input(byIdSchema)
    .query(
      async ({
        input,
        ctx,
      }): Promise<SelectUserMetadataWithClubs | undefined> => {
        const { id } = input;
        const userMetadata = await ctx.db.query.userMetadata.findFirst({
          where: (userMetadata) => eq(userMetadata.id, id),
          with: { clubs: true },
        });

        return userMetadata;
      },
    ),
  updateById: authedProcedure
    .input(updateByIdSchema)
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<SelectUserMetadataWithClubs | undefined> => {
        const { updateUser, clubs } = input;
        const { user } = ctx.session;

        const updatedUser = (
          await ctx.db
            .update(userMetadata)
            .set(updateUser)
            .where(eq(userMetadata.id, user.id))
            .returning()
        )[0];

        let updatedClubs: SelectUserMetadataToClubs[] = [];

        if (clubs !== undefined) {
          if (clubs.length === 0) {
            await ctx.db
              .delete(userMetadataToClubs)
              .where(and(eq(userMetadataToClubs.userId, user.id)));
          } else {
            updatedClubs = await ctx.db
              .delete(userMetadataToClubs)
              .where(
                and(
                  eq(userMetadataToClubs.userId, user.id),
                  // Invert the condition to delete all clubs that are not in the array
                  sql`${userMetadataToClubs.clubId} NOT IN (${clubs})`,
                ),
              )
              .returning();
          }
        }

        // Update `name` field in BetterAuth user information to match user metadata
        const name = `${updateUser.firstName} ${updateUser.lastName}`;
        if (user.name != name) {
          try {
            await auth.api.updateUser({
              body: { name },
              headers: await headers(),
            });
          } catch (e) {
            console.error(
              `Unable to update name field for${updateUser.firstName ? ` ${name}'s` : ''} user information`,
              e,
            );
          }
        }

        return { ...updatedUser!, clubs: updatedClubs };
      },
    ),
  deleteById: authedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    await ctx.db.delete(users).where(eq(users.id, user.id));
    await ctx.db.delete(userMetadata).where(eq(userMetadata.id, user.id));
  }),
  getRegisteredEventsByRange: authedProcedure
    .input(getByRangeSchema)
    .query(async ({ input, ctx }) => {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      return ctx.db.query.events.findMany({
        where: (e) =>
          and(
            eq(e.status, 'approved'),
            lt(e.startTime, end),
            gt(e.endTime, start),
            inArray(
              e.id,
              ctx.db
                .select({ id: userMetadataToEvents.eventId })
                .from(userMetadataToEvents)
                .where(eq(userMetadataToEvents.userId, ctx.session.user.id)),
            ),
          ),
        with: { club: true },
      });
    }),
  getEvents: authedProcedure
    .input(eventsSortSchema)
    .query(async ({ input, ctx }) => {
      const { currentTime, sortByDate } = input;

      const rows = await ctx.db.query.userMetadataToEvents.findMany({
        where: (userMetadataToEvents) =>
          eq(userMetadataToEvents.userId, ctx.session.user.id),
        with: {
          event: {
            with: {
              club: true,
            },
          },
        },
      });

      let events = rows
        .map((item) => item.event)
        .filter((ev) => ev.status === 'approved');

      if (currentTime) {
        events = events.filter((ev) => ev.endTime >= currentTime);
      }

      if (sortByDate) {
        events = events.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );
      }

      return events;
    }),
  getEventsFromJoinedClubs: authedProcedure
    .input(joinedClubEventsSchema)
    .query(async ({ input, ctx }) => {
      const { currentTime, sortByDate } = input;

      const page = Math.max(1, input.page ?? 1);
      const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 12));
      const offset = (page - 1) * pageSize;

      const clubRows = await ctx.db
        .select({ clubId: userMetadataToClubs.clubId })
        .from(userMetadataToClubs)
        .where(
          and(
            eq(userMetadataToClubs.userId, ctx.session.user.id),
            inArray(userMetadataToClubs.memberType, [
              'Member',
              'Officer',
              'President',
            ]),
          ),
        );

      const clubIds = clubRows.map((row) => row.clubId);
      if (clubIds.length === 0) return [];

      const now = currentTime ?? new Date();

      const rows = await ctx.db.query.events.findMany({
        where: (e) =>
          and(
            inArray(e.clubId, clubIds),
            currentTime ? gte(e.endTime, now) : undefined,
            eq(e.status, 'approved'),
          ),
        orderBy: sortByDate ? (e) => [e.startTime] : undefined,
        with: { club: true },
        limit: pageSize,
        offset,
      });

      return rows;
    }),
  countEventsFromJoinedClubs: authedProcedure
    .input(joinedClubEventsSchema)
    .query(async ({ input, ctx }) => {
      const clubRows = await ctx.db
        .select({ clubId: userMetadataToClubs.clubId })
        .from(userMetadataToClubs)
        .where(
          and(
            eq(userMetadataToClubs.userId, ctx.session.user.id),
            inArray(userMetadataToClubs.memberType, [
              'Member',
              'Officer',
              'President',
            ]),
          ),
        );

      const clubIds = clubRows.map((row) => row.clubId);
      if (clubIds.length === 0) return 0;

      const now = input.currentTime ?? new Date();

      const whereClause = input.currentTime
        ? and(
            inArray(events.clubId, clubIds),
            gte(events.endTime, now),
            eq(events.status, 'approved'),
          )
        : inArray(events.clubId, clubIds);

      const result = await ctx.db
        .select({ value: count() })
        .from(events)
        .where(whereClause);
      const value = result[0]?.value ?? 0;

      return value;
    }),
  getUserSidebarCapabilities: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    const capabilites: (typeof personalCats)[number][] = [];
    if (!session) return capabilites;

    const [isOfficer, isAdmin] = await Promise.all([
      ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, session.user.id),
          or(
            eq(userMetadataToClubs.memberType, 'Officer'),
            eq(userMetadataToClubs.memberType, 'President'),
          ),
        ),
      }),
      ctx.db.query.admin.findFirst({
        where: eq(admin.userId, session.user.id),
      }),
    ]);
    if (isOfficer) {
      capabilites.push('Manage Clubs');
    } else {
      capabilites.push('Create Club');
    }
    if (isAdmin) capabilites.push('Admin');
    return capabilites;
  }),
});

export default userMetadataRouter;
