import { TZDateMini } from '@date-fns/tz';
import { TRPCError } from '@trpc/server';
import {
  add,
  lastDayOfMonth,
  lastDayOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
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
import { club } from '@src/server/db/schema/club';
import { events } from '@src/server/db/schema/events';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@src/server/db/schema/users';
import { stopWatching } from '@src/utils/calendar';
import {
  dateSchemaLegacy,
  eventParamsSchemaOutput,
  temporalDeixisCustomDateSentinelValue,
} from '@src/utils/eventFilter';
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
  // date: z.date(),
  // order: order,
  // club: z.string().array(),
  filters: eventParamsSchemaOutput,
});
export const findByDateSchema = z.object({
  date: dateSchemaLegacy,
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

        // const parsed = approvedEvents.map((e) => selectEvent.parse(e));
        // return parsed;
        return approvedEvents;
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
      const filters = input.filters;

      const page = filters.page ?? 1;
      const pageSize = filters.size ?? 20;

      // console.log('filters', filters);
      console.log('🔍 findByFilters called');

      const events = await ctx.db.query.events.findMany({
        where: (event) => {
          const conditions: Array<SQL<unknown> | undefined> = [];

          conditions.push(eq(event.status, 'approved'));

          /**
           * True if date is "custom" but dateStart and dateEnd aren't provided.
           * In other words, if user has clicked "custom" but hasn't finished
           * entering both a start date and end date yet.
           */
          const unfinishedCustomDate =
            filters.date === temporalDeixisCustomDateSentinelValue &&
            (!filters.dateStart || !filters.dateEnd);

          // past, date, dateStart, dateEnd
          if (
            !unfinishedCustomDate &&
            (filters.date || (filters.dateStart && filters.dateEnd))
          ) {
            let startTime: Date | undefined;
            let endTime: Date | undefined;

            const today = startOfDay(new Date());

            switch (filters.date) {
              case 'today':
                startTime = today;
                endTime = add(today, { days: 1 });
                break;
              case 'tomorrow':
                startTime = add(today, { days: 1 });
                endTime = add(today, { days: 2 });
                break;
              case 'this weekend':
                // Beginning of this Saturday
                startTime = lastDayOfWeek(today);
                // End of next Sunday
                endTime = add(startOfWeek(add(today, { weeks: 1 })), {
                  days: 1,
                });
                break;
              case 'this week':
                startTime = filters.past ? startOfWeek(today) : today;
                endTime = add(lastDayOfWeek(today), { days: 1 });
                break;
              case 'this month':
                startTime = filters.past ? startOfMonth(today) : today;
                endTime = add(lastDayOfMonth(today), { days: 1 });
                break;
              case temporalDeixisCustomDateSentinelValue:
              // Go to default case, in case dateStart and dateEnd exist but date is invalid
              default:
                if (filters.dateStart && filters.dateEnd) {
                  startTime = startOfDay(filters.dateStart);
                  endTime = add(startOfDay(filters.dateEnd), { days: 1 });
                }
                break;
            }

            if (startTime && endTime) {
              conditions.push(
                or(
                  between(event.startTime, startTime, endTime),
                  between(event.endTime, startTime, endTime),
                  and(
                    lte(event.startTime, startTime),
                    gte(event.endTime, startTime),
                  ),
                  and(
                    lte(event.startTime, endTime),
                    gte(event.endTime, endTime),
                  ),
                ),
              );
            } else if (filters.date !== temporalDeixisCustomDateSentinelValue) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: `Invalid key for filters.date: ${filters.date}`,
              });
            }
          } else if (filters.past) {
            // Only get events from the past
            conditions.push(lte(event.startTime, startOfDay(new Date())));
          } else {
            // Get events happening in the present/future
            conditions.push(gte(event.startTime, startOfDay(new Date())));
          }

          // if (input.club.length !== 0) {
          //   whereElements.push(inArray(event.clubId, input.club));
          // }

          return and(...conditions);
        },
        orderBy: (events, { asc, desc }) => {
          switch (filters.sort) {
            case 'upcoming':
              // If past and no custom date, sort by recency
              const sortByRecency =
                filters.past &&
                !filters.date &&
                !filters.dateStart &&
                !filters.dateEnd;

              if (sortByRecency) {
                return [desc(events.startTime)];
              } else {
                return [asc(events.startTime)];
              }
            case 'updated':
              return [desc(events.updatedAt)];
          }
        },
        offset: (page - 1) * pageSize,
        with: {
          club: true,
        },
        limit: pageSize,
        extras: {
          'internal-total': sql<number>`CAST(COUNT(*) OVER() AS INTEGER)`.as(
            'internal-total',
          ),
        },
      });

      // Removes certain keys from event object, to reduce network usage
      const cleanedEvents = events.map((event) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ['internal-total']: total, ...rest } = event;
        return rest;
      });

      const totalCount = events[0]?.['internal-total'] ?? 0;
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        data: cleanedEvents,
        pagination: {
          page: Math.min(page, totalPages + 1),
          size: pageSize,
          total: totalCount,
          totalPages: totalPages,
        },
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
