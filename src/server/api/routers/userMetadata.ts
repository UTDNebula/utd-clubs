import { and, eq, or, sql, gte, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { type personalCats } from '@src/constants/categories';
import { auth } from '@src/server/auth';
import { insertUserMetadata } from '@src/server/db/models';
import { admin } from '@src/server/db/schema/admin';
import { user as users } from '@src/server/db/schema/auth';
import { userMetadata, userMetadataToClubs } from '@src/server/db/schema/users';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { count } from 'console';
import { events } from '@src/server/db/schema/events';

const byIdSchema = z.object({ id: z.string() });

const updateByIdSchema = z.object({
  updateUser: insertUserMetadata.omit({ id: true }),
  clubs: z.string().array(),
});
const nameOrEmailSchema = z.object({
  search: z.string().default(''),
});

const eventsSortSchema = z.object({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
});

const joinedClubEventsSchema = z.object({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

export const userMetadataRouter = createTRPCRouter({
  byId: protectedProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;
    const userMetadata = await ctx.db.query.userMetadata.findFirst({
      where: (userMetadata) => eq(userMetadata.id, id),
      with: { clubs: true },
    });

    return userMetadata;
  }),
  updateById: protectedProcedure
    .input(updateByIdSchema)
    .mutation(async ({ input, ctx }) => {
      const { updateUser, clubs } = input;
      const { user } = ctx.session;

      await ctx.db
        .update(userMetadata)
        .set(updateUser)
        .where(eq(userMetadata.id, user.id));

      if (clubs.length === 0) {
        await ctx.db
          .delete(userMetadataToClubs)
          .where(and(eq(userMetadataToClubs.userId, user.id)));
        return;
      }

      await ctx.db.delete(userMetadataToClubs).where(
        and(
          eq(userMetadataToClubs.userId, user.id),
          // Invert the condition to delete all clubs that are not in the array
          sql`${userMetadataToClubs.clubId} NOT IN (${clubs})`,
        ),
      );
      if (user.name != updateUser.firstName + ' ' + updateUser.lastName) {
        await auth.api.updateUser({
          body: { name: updateUser.firstName + ' ' + updateUser.lastName },
        });
      }
    }),
  deleteById: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    await ctx.db.delete(users).where(eq(users.id, user.id));
    await ctx.db.delete(userMetadata).where(eq(userMetadata.id, user.id));
  }),
  getEvents: protectedProcedure
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

      let events = rows.map((item) => item.event);

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
  getEventsFromJoinedClubs: protectedProcedure
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
            inArray(userMetadataToClubs.memberType, ['Member', 'Officer', 'President']),
          ),
        );

        const clubIds = clubRows.map((row) => row.clubId);
        if (clubIds.length === 0) return[];

        const now = currentTime ?? new Date(); 

        const rows = await ctx.db.query.events.findMany({
          where: (e) =>
            and(
              inArray(e.clubId, clubIds),
              currentTime ? gte(e.endTime, now) : undefined, 
            ),
          orderBy: sortByDate ? (e) => [e.startTime] : undefined,
          with: { club: true },
          limit: pageSize,
          offset,
        })

        return rows;
    }),
    countEventsFromJoinedClubs: protectedProcedure
    .input(joinedClubEventsSchema)
    .query(async ({ input, ctx }) => {
      const clubRows = await ctx.db
        .select({ clubId: userMetadataToClubs.clubId })
        .from(userMetadataToClubs)
        .where(
          and(
            eq(userMetadataToClubs.userId, ctx.session.user.id),
            inArray(userMetadataToClubs.memberType, ['Member', 'Officer', 'President']),
          ),
        );

        const clubIds = clubRows.map((row) => row.clubId);
        if (clubIds.length === 0) return 0;

        const now = input.currentTime ?? new Date();

        const whereClause = input.currentTime
          ? and(inArray(events.clubId, clubIds), gte(events.endTime, now))
          : inArray(events.clubId, clubIds);

        const result = await ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(events)
          .where(whereClause);
        const count = result[0]?.count ?? 0;

        return count;
    }),
  searchByNameOrEmail: publicProcedure
    .input(nameOrEmailSchema)
    .query(async ({ input, ctx }) => {
      const q = `%${input.search}%`;

      const result = await ctx.db
        .select({
          id: users.id,
          email: users.email,
          firstName: userMetadata.firstName,
          lastName: userMetadata.lastName,
        })
        .from(users)
        .leftJoin(userMetadata, eq(userMetadata.id, users.id))
        .where(
          sql`
            CONCAT(${userMetadata.firstName}, ' ', ${userMetadata.lastName}) ILIKE ${q}
            OR ${users.email} ILIKE ${q}
          `,
        );

      return result;
    }),
  getUserSidebarCapabilities: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    const capabilites: (typeof personalCats)[number][] = [];
    if (!session) return capabilites;
    if (
      await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, session.user.id),
          or(
            eq(userMetadataToClubs.memberType, 'Officer'),
            eq(userMetadataToClubs.memberType, 'President'),
          ),
        ),
      })
    ) {
      capabilites.push('Manage Clubs');
    }
    if (
      (
        await ctx.db.query.admin.findMany({
          where: eq(admin.userId, session.user.id),
        })
      ).length === 1
    )
      capabilites.push('Admin');
    return capabilites;
  }),
});
