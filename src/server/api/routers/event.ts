import {
  eq,
  gte,
  lte,
  and,
  ilike,
  or,
  sql,
  inArray,
  type SQL,
  between,
} from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { selectEvent } from '@src/server/db/models';
import { add, startOfDay } from 'date-fns';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@src/server/db/schema/users';
import { createEventSchema } from '@src/utils/formSchemas';
import { TRPCError } from '@trpc/server';
import { events } from '@src/server/db/schema/events';

const byClubIdSchema = z.object({
  clubId: z.string().default(''),
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
});

const byDateRangeSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
});
export const findByFilterSchema = z.object({
  date: z.date(),
  order: z.enum(['soon', 'later', 'shortest duration', 'longest duration']),
  club: z.string().array(),
});
export const findByDateSchema = z.object({
  date: z.date(),
});

const byIdSchema = z.object({
  id: z.string().default(''),
});

const byNameSchema = z.object({
  name: z.string().default(''),
  sortByDate: z.boolean().default(false),
});
const joinLeaveSchema = z.object({
  id: z.string(),
});

export const eventRouter = createTRPCRouter({
  byClubId: publicProcedure
    .input(byClubIdSchema)
    .query(async ({ input, ctx }) => {
      const { clubId, currentTime, sortByDate } = input;

      try {
        const events = await ctx.db.query.events.findMany({
          where: (event) =>
            currentTime
              ? and(eq(event.clubId, clubId), gte(event.startTime, currentTime))
              : eq(event.clubId, clubId),
          orderBy: sortByDate ? (event) => [event.startTime] : undefined,
        });

        const parsed = events.map((e) => selectEvent.parse(e));
        return parsed;
      } catch (e) {
        console.error(e);

        throw e;
      }
    }),
  byDateRange: publicProcedure
    .input(byDateRangeSchema)
    .query(async ({ input, ctx }) => {
      const { startTime, endTime } = input;

      try {
        const events = await ctx.db.query.events.findMany({
          where: (event) => {
            return and(
              gte(event.startTime, startTime),
              lte(event.endTime, endTime),
            );
          },
        });

        const parsed = events.map((e) => selectEvent.parse(e));
        return parsed;
      } catch (e) {
        console.error(e);

        throw e;
      }
    }),
  findByDate: publicProcedure
    .input(findByDateSchema)
    .query(async ({ input, ctx }) => {
      const startTime = startOfDay(input.date);
      const endTime = add(startTime, { days: 1 });
      const events = await ctx.db.query.events.findMany({
        where: (event) => {
          return or(
            between(event.startTime, startTime, endTime),
            between(event.endTime, startTime, endTime),
            and(lte(event.startTime, startTime), gte(event.endTime, startTime)),
            and(lte(event.startTime, endTime), gte(event.endTime, endTime)),
          );
        },

        with: {
          club: true,
        },
        limit: 20,
      });
      if (ctx.session) {
        const user = ctx.session.user;
        const eventsWithLike = await Promise.all(
          events.map(async (ev) => {
            const liked = !!(await ctx.db.query.userMetadataToEvents.findFirst({
              where: (userMetadataToEvents) =>
                and(
                  eq(userMetadataToEvents.userId, user.id),
                  eq(userMetadataToEvents.eventId, ev.id),
                ),
            }));
            return { ...ev, liked: liked };
          }),
        );
        return { events: eventsWithLike };
      }
      return {
        events: events.map((event) => {
          return { ...event, liked: false };
        }),
      };
    }),
  findByFilters: publicProcedure
    .input(findByFilterSchema)
    .query(async ({ input, ctx }) => {
      const startTime = startOfDay(input.date);
      const endTime = add(startTime, { days: 1 });
      const events = await ctx.db.query.events.findMany({
        where: (event) => {
          const whereElements: Array<SQL<unknown> | undefined> = [];
          whereElements.push(
            or(
              between(event.startTime, startTime, endTime),
              between(event.endTime, startTime, endTime),
              and(
                lte(event.startTime, startTime),
                gte(event.endTime, startTime),
              ),
              and(lte(event.startTime, endTime), gte(event.endTime, endTime)),
            ),
          );

          if (input.club.length !== 0) {
            whereElements.push(inArray(event.clubId, input.club));
          }
          return and(...whereElements);
        },
        orderBy: (events, { asc, desc }) => {
          switch (input.order) {
            case 'soon':
              return [asc(events.startTime)];
            case 'later':
              return [desc(events.startTime)];
            case 'shortest duration':
              return [asc(sql`${events.endTime} - ${events.startTime}`)];
            case 'longest duration':
              return [desc(sql`${events.endTime} - ${events.startTime}`)];
          }
        },
        with: {
          club: true,
        },
        limit: 20,
      });
      if (ctx.session) {
        const user = ctx.session.user;
        const eventsWithLike = await Promise.all(
          events.map(async (ev) => {
            const liked = !!(await ctx.db.query.userMetadataToEvents.findFirst({
              where: (userMetadataToEvents) =>
                and(
                  eq(userMetadataToEvents.userId, user.id),
                  eq(userMetadataToEvents.eventId, ev.id),
                ),
            }));
            return { ...ev, liked: liked };
          }),
        );
        return { events: eventsWithLike };
      }
      return {
        events: events.map((event) => {
          return { ...event, liked: false };
        }),
      };
    }),
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;

    try {
      const byId = await ctx.db.query.events.findFirst({
        where: (event) => eq(event.id, id),
        with: { club: true },
      });

      return byId;
    } catch (e) {
      console.error(e);

      throw e;
    }
  }),
  joinEvent: protectedProcedure
    .input(joinLeaveSchema)
    .mutation(async ({ input, ctx }) => {
      const eventId = input.id;
      const userId = ctx.session.user.id;
      await ctx.db
        .insert(userMetadataToEvents)
        .values({ userId: userId, eventId: eventId })
        .onConflictDoNothing();
    }),
  leaveEvent: protectedProcedure
    .input(joinLeaveSchema)
    .mutation(async ({ input, ctx }) => {
      const eventId = input.id;
      const userId = ctx.session.user.id;
      await ctx.db
        .delete(userMetadataToEvents)
        .where(
          and(
            eq(userMetadataToEvents.userId, userId),
            eq(userMetadataToEvents.eventId, eventId),
          ),
        );
    }),
  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ input, ctx }) => {
      const { clubId } = input;
      const userId = ctx.session.user.id;

      const isOfficer = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, userId),
          eq(userMetadataToClubs.clubId, clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
      });
      if (!isOfficer) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const res = await ctx.db
        .insert(events)
        .values({ ...input })
        .returning({ id: events.id });
      if (res.length == 0)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add event',
        });
      return res[0]?.id;
    }),
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name, sortByDate } = input;
    try {
      const events = await ctx.db.query.events.findMany({
        where: (event) => ilike(event.name, `%${name}%`),
        orderBy: sortByDate
          ? (event, { desc }) => [desc(event.startTime)]
          : undefined,
      });

      return events;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }),
});
