import { TRPCError } from '@trpc/server';
import { and, count, eq, gt, gte, inArray, lt } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@/server/db/schema/users';
import { getGoogleAccessToken } from '@/lib/modules/googleOAuth';
import {
  createTRPCRouter,
  authedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { events } from '@/server/db/schema/events';
import { eventIdSchema } from '../baseSchemas';
import {
  getByRangeSchema,
  eventsSortSchema,
  joinedClubEventsSchema,
} from './inputSchemas';

const userEventsRouter = createTRPCRouter({
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
  joinedEvent: publicProcedure
    .input(eventIdSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;
      const eventId = input.eventId;
      const userId = ctx.session.user.id;
      return Boolean(
        await ctx.db.query.userMetadataToEvents.findFirst({
          where: (userMetadataToEvents) =>
            and(
              eq(userMetadataToEvents.userId, userId),
              eq(userMetadataToEvents.eventId, eventId),
            ),
        }),
      );
    }),
  registerState: publicProcedure
    .input(eventIdSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;

      const eventId = input.eventId;
      const userId = ctx.session.user.id;
      const result = await ctx.db.query.userMetadataToEvents.findFirst({
        where: (userMetadataToEvents) =>
          and(
            eq(userMetadataToEvents.userId, userId),
            eq(userMetadataToEvents.eventId, eventId),
          ),
      });
      return {
        registered: Boolean(result),
        registeredAt: result?.registeredAt ?? null,
      };
    }),
  toggleRegistration: authedProcedure
    .input(eventIdSchema)
    .mutation(async ({ ctx, input }) => {
      const eventId = input.eventId;
      const userId = ctx.session.user.id;
      const dataExists = await ctx.db.query.userMetadataToEvents.findFirst({
        where: (userMetadataToEvents) =>
          and(
            eq(userMetadataToEvents.userId, userId),
            eq(userMetadataToEvents.eventId, eventId),
          ),
      });
      if (dataExists) {
        await ctx.db
          .delete(userMetadataToEvents)
          .where(
            and(
              eq(userMetadataToEvents.userId, userId),
              eq(userMetadataToEvents.eventId, eventId),
            ),
          );
      } else {
        await ctx.db
          .insert(userMetadataToEvents)
          .values({ userId, eventId, registeredAt: new Date() });
      }
      return dataExists;
    }),
  getUserCalendars: authedProcedure.query(async ({ ctx }) => {
    const accessToken = await getGoogleAccessToken(ctx.session.user.id, true);
    const googleOauthClient = new OAuth2Client();
    googleOauthClient.setCredentials({ access_token: accessToken });
    try {
      const res = await googleOauthClient.fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      );
      if (res.ok) {
        return (
          res.data as {
            items: { id: string; summary: string; description: string }[];
          }
        ).items;
      } else {
        throw new TRPCError({
          message: JSON.stringify(res.data),
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }),
});

export default userEventsRouter;
