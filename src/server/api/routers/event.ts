import { TZDateMini } from '@date-fns/tz';
import { TRPCError } from '@trpc/server';
import { add, startOfDay } from 'date-fns';
import {
  and,
  between,
  count,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { z } from 'zod';
import { selectEvent } from '@src/server/db/models';
import { club } from '@src/server/db/schema/club';
import { events } from '@src/server/db/schema/events';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@src/server/db/schema/users';
import { stopWatching } from '@src/utils/calendar';
import { dateSchema, order } from '@src/utils/eventFilter';
import { createEventSchema, editEventSchema } from '@src/utils/formSchemas';
import { getGoogleAccessToken } from '@src/utils/googleAuth';
// import { callStorageAPI } from '@src/utils/storage';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const byClubIdSchema = z.object({
  clubId: z.string().default(''),
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  includePast: z.boolean().optional().default(false),
});
const countByClubIdSchema = z.object({
  clubId: z.string(),
  includePast: z.boolean().optional().default(false),
  currentTime: z.optional(z.date()),
});
const clubUpcomingEventsSchema = z.object({
  clubId: z.string(),
  currentTime: z.date().optional(),
});
const byDateRangeSchema = z.object({
  startTime: z.date().optional(),
  endTime: z.date().optional(),
});
export const findByFilterSchema = z.object({
  date: z.date(),
  order: order,
  club: z.string().array(),
});
export const findByDateSchema = z.object({
  date: dateSchema,
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
      const { clubId, currentTime, sortByDate, includePast } = input;
      const page = Math.max(1, input.page ?? 1);
      const pageSize = Math.max(1, Math.min(50, input.pageSize ?? 12));
      const offset = (page - 1) * pageSize;
      const now = currentTime ?? new Date();

      try {
        const events = await ctx.db.query.events.findMany({
          where: (event) => {
            const base = and(
              eq(event.clubId, clubId),
              eq(event.status, 'approved'),
            );
            if (includePast) return base;
            return and(base, gte(event.endTime, now));
          },
          orderBy: sortByDate ? (event) => [event.startTime] : undefined,
          with: { club: true },
          limit: pageSize,
          offset: offset,
        });

        return events;
      } catch (e) {
        console.error(e);

        throw e;
      }
    }),
  countByClubId: publicProcedure
    .input(countByClubIdSchema)
    .query(async ({ input, ctx }) => {
      const { clubId, includePast } = input;
      const now = input.currentTime ?? new Date();

      try {
        const whereCondition = includePast
          ? and(eq(events.clubId, clubId), eq(events.status, 'approved'))
          : and(
              eq(events.clubId, clubId),
              gte(events.endTime, now),
              eq(events.status, 'approved'),
            );
        const result = await ctx.db
          .select({ value: count() })
          .from(events)
          .where(whereCondition);
        const value = result[0]?.value ?? 0;

        return value;
      } catch (e) {
        console.error(e);

        throw e;
      }
    }),
  clubUpcoming: publicProcedure
    .input(clubUpcomingEventsSchema)
    .query(async ({ input, ctx }) => {
      const { clubId, currentTime } = input;

      try {
        const now = currentTime ?? new Date();
        const threeMonthsLater = add(now, { months: 3 });

        const upcomingEvents = await ctx.db.query.events.findMany({
          where: (event) =>
            and(
              eq(event.clubId, clubId),
              eq(event.status, 'approved'),
              gte(event.endTime, now),
              lte(event.startTime, threeMonthsLater),
            ),
          orderBy: (event, { asc }) => [asc(event.startTime)],
          with: { club: true },
          limit: 18,
        });

        return upcomingEvents;
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
              eq(event.status, 'approved'),
              or(
                startTime ? gte(event.startTime, startTime) : undefined,
                endTime ? lte(event.endTime, endTime) : undefined,
              ),
            );
          },
          with: {
            club: true,
          },
        });

        const approvedEvents = events.filter(
          (e) => e.club.approved === 'approved',
        );

        const parsed = approvedEvents.map((e) => selectEvent.parse(e));
        return parsed;
      } catch (e) {
        console.error(e);

        throw e;
      }
    }),
  findByDate: publicProcedure
    .input(findByDateSchema)
    .query(async ({ input, ctx }) => {
      const zone = 'America/Chicago';
      const [year, month, day] = input.date.split('-').map(Number);
      const backup = new TZDateMini(zone);
      const startCT = startOfDay(
        new TZDateMini(
          year ?? backup.getFullYear(),
          (month ?? backup.getMonth()) - 1,
          day ?? backup.getDate(),
          zone,
        ),
      );
      const endCT = add(startCT, { days: 1 });
      const startUTC = new Date(startCT.getTime());
      const endUTC = new Date(endCT.getTime());
      const events = await ctx.db.query.events.findMany({
        where: (event) => {
          return and(
            eq(event.status, 'approved'),
            or(
              between(event.startTime, startUTC, endUTC),
              between(event.endTime, startUTC, endUTC),
              and(lte(event.startTime, startUTC), gte(event.endTime, startUTC)),
              and(lte(event.startTime, endUTC), gte(event.endTime, endUTC)),
            ),
          );
        },
        orderBy: (event, { asc }) => [asc(event.startTime)],
        with: {
          club: true,
        },
        limit: 20,
      });
      const approvedEvents = events.filter(
        (e) => e.club.approved === 'approved',
      );

      return {
        events: approvedEvents,
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
            and(
              eq(event.status, 'approved'),
              or(
                between(event.startTime, startTime, endTime),
                between(event.endTime, startTime, endTime),
                and(
                  lte(event.startTime, startTime),
                  gte(event.endTime, startTime),
                ),
                and(lte(event.startTime, endTime), gte(event.endTime, endTime)),
              ),
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

      return {
        events: events,
      };
    }),
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;

    try {
      const byId = await ctx.db.query.events.findFirst({
        where: (event) => and(eq(event.id, id), eq(event.status, 'approved')),
        with: { club: true },
      });

      return byId;
    } catch (e) {
      console.error(e);

      throw e;
    }
  }),
  getListingInfo: publicProcedure
    .input(byIdSchema)
    .query(async ({ input: { id }, ctx }) => {
      try {
        // Fetch event by id
        const byId = await ctx.db.query.events.findFirst({
          where: (event) => and(eq(event.id, id), eq(event.status, 'approved')),
          with: {
            club: {
              with: {
                contacts: {
                  orderBy: (contacts, { asc }) => asc(contacts.displayOrder),
                },
              },
            },
            userMetadataToEvents: {
              columns: {
                userId: true, // Only fetch the ID to keep the payload small
              },
            },
          },
        });

        if (!byId) return null;

        const { userMetadataToEvents, ...eventData } = byId; // eventData doesn't have userMetadataToEvents field
        return {
          ...eventData,
          numParticipants: userMetadataToEvents.length,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  joinedEvent: publicProcedure
    .input(joinLeaveSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;
      const eventId = input.id;
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
    .input(joinLeaveSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;

      const eventId = input.id;
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
  toggleRegistration: protectedProcedure
    .input(joinLeaveSchema)
    .mutation(async ({ ctx, input }) => {
      const eventId = input.id;
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
      const newEvent = res[0];
      if (!newEvent)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add event',
        });
      return newEvent.id;
    }),
  update: protectedProcedure
    .input(editEventSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, clubId, ...data } = input;
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
        .where(eq(events.id, id))
        .returning({ id: events.id });

      if (res.length == 0)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update event',
        });
      return res[0]?.id;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const event = await ctx.db.query.events.findFirst({
        where: (e) => eq(e.id, input.id),
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      const isOfficer = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, userId),
          eq(userMetadataToClubs.clubId, event.clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
      });
      if (!isOfficer) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      // await callStorageAPI('DELETE', `${event.clubId}-event-${event.id}`);

      // await ctx.db
      //   .delete(userMetadataToEvents)
      //   .where(eq(userMetadataToEvents.eventId, input.id));
      await ctx.db
        .update(events)
        .set({ status: 'deleted' })
        .where(eq(events.id, input.id));

      return { success: true };
    }),
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name, sortByDate } = input;
    try {
      const events = await ctx.db.query.events.findMany({
        where: (event) =>
          and(eq(event.status, 'approved'), ilike(event.name, `%${name}%`)),
        orderBy: sortByDate
          ? (event, { desc }) => [desc(event.startTime)]
          : undefined,
        with: {
          club: true,
        },
      });

      const approvedEvents = events.filter(
        (e) => e.club.approved === 'approved',
      );

      return approvedEvents;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }),
  getUserCalendars: protectedProcedure.query(async ({ ctx }) => {
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
  disableSync: protectedProcedure
    .input(
      z.object({
        clubId: z.string(),
        keepPastEvents: z.boolean().default(true).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const clubRecord = await ctx.db.query.club.findFirst({
        where: eq(club.id, input.clubId),
        columns: { calendarId: true },
      });

      if (!clubRecord) throw new TRPCError({ code: 'NOT_FOUND' });

      const isOfficer = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, userId),
          eq(userMetadataToClubs.clubId, input.clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
      });
      if (!isOfficer) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

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
              ? eq(events.calendarId, clubRecord.calendarId)
              : undefined,
            input.keepPastEvents ? gt(events.startTime, new Date()) : undefined, // IF indicated, delete only events that have not yet started
          ),
        );

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
