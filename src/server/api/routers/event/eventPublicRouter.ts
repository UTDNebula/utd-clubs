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
  arrayOverlaps,
  asc,
  between,
  count,
  desc,
  eq,
  exists,
  gte,
  ilike,
  inArray,
  lte,
  notExists,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { club } from '@/server/db/schema/club';
import { events } from '@/server/db/schema/events';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@/server/db/schema/users';
import { temporalDeixisCustomDateSentinelValue } from '@/common/utils/eventFilter';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import {
  byClubIdSchema,
  byDateRangeSchema,
  byIdSchema,
  byNameSchema,
  clubUpcomingEventsSchema,
  countSchema,
  findByDateSchema,
  findByFilterSchema,
} from './schemas';

const eventPublicRouter = createTRPCRouter({
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
  count: publicProcedure.input(countSchema).query(async ({ input, ctx }) => {
    const { clubId, includePast, includeAll } = input;
    const now = input.currentTime ?? new Date();

    try {
      const conditions: Array<SQL<unknown> | undefined> = [];

      conditions.push(eq(events.status, 'approved'));
      if (!includePast) {
        conditions.push(gte(events.endTime, now));
      }
      if (!includeAll) {
        conditions.push(lte(events.startTime, add(now, { years: 1 })));
      }
      if (clubId) {
        conditions.push(eq(events.clubId, clubId));
      }

      const result = await ctx.db
        .select({ value: count() })
        .from(events)
        .where(and(...conditions));
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
      const signedIn = ctx.session;
      const userId = ctx.session?.user.id;

      const filters = input.filters;

      const page = filters.page ?? 1;
      const pageSize = Math.min(filters.size, 100) ?? 20;

      const registeredEventsSubquery = userId
        ? ctx.db
            .select()
            .from(userMetadataToEvents)
            .where(
              and(
                eq(userMetadataToEvents.eventId, events.id),
                eq(userMetadataToEvents.userId, userId),
              ),
            )
        : undefined;

      const joinedClubsSubquery = userId
        ? ctx.db
            .select()
            .from(userMetadataToClubs)
            .where(
              and(
                eq(userMetadataToClubs.clubId, events.clubId),
                eq(userMetadataToClubs.userId, userId),
                inArray(userMetadataToClubs.memberType, [
                  'Member',
                  'Officer',
                  'President',
                ]),
              ),
            )
        : undefined;

      try {
        let query = ctx.db
          .select({
            events,
            club,
            isRegistered: registeredEventsSubquery
              ? exists(registeredEventsSubquery)
              : sql<boolean>`false`,
            isClubMember: joinedClubsSubquery
              ? exists(joinedClubsSubquery)
              : sql<boolean>`false`,
            'internal-count': sql<number>`count(*) OVER()`.mapWith(Number),
          })
          .from(events)
          .leftJoin(club, eq(events.clubId, club.id))
          .$dynamic();

        query = query
          .where((tables) => {
            const events = tables.events;
            const club = tables.club;

            const conditions: Array<SQL<unknown> | undefined> = [];

            conditions.push(eq(events.status, 'approved'));

            /**
             * True if date is "custom" but dateStart and dateEnd aren't provided.
             * In other words, if user has clicked "custom" but hasn't finished
             * entering both a start date and end date yet.
             */
            const unfinishedCustomDate =
              filters.date === temporalDeixisCustomDateSentinelValue &&
              (!filters.dateStart || !filters.dateEnd);

            const now = new Date();
            const today = startOfDay(now);

            // filters.(past, date, dateStart, dateEnd)
            if (
              !unfinishedCustomDate &&
              (filters.date || (filters.dateStart && filters.dateEnd))
            ) {
              let startTime: Date | undefined;
              let endTime: Date | undefined;

              switch (filters.date) {
                case 'today':
                  startTime = filters.past ? today : now;
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
                  startTime = filters.past ? startOfWeek(today) : now;
                  endTime = add(lastDayOfWeek(today), { days: 1 });
                  break;
                case 'this month':
                  startTime = filters.past ? startOfMonth(today) : now;
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
                  and(
                    lte(events.startTime, endTime),
                    gte(events.endTime, startTime),
                  ),
                );
              } else if (
                filters.date !== temporalDeixisCustomDateSentinelValue
              ) {
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: `Invalid key for filters.date: ${filters.date}`,
                });
              }
            } else if (filters.past) {
              // Get events from the present and past
              conditions.push(lte(events.startTime, now));
            } else {
              // Get events in the present and future
              conditions.push(
                and(
                  or(gte(events.startTime, now), gte(events.endTime, now)),
                  lte(events.startTime, add(now, { years: 1 })),
                ),
              );
            }

            // filters.tags
            if (filters.tags && filters.tags.length > 0) {
              conditions.push(arrayOverlaps(club.tags, filters.tags));
            }

            // filters.location
            if (filters.location) {
              // TODO: Either parse the events.location column or add another column similar to filters.location
            }

            // filters.locationExclude
            if (filters.locationExclude) {
              // TODO: Either parse the events.location column or add another column similar to filters.location
            }

            // filters.query
            if (filters.query) {
              conditions.push(
                sql`${events.id} @@@
              paradedb.boolean(
                should => ARRAY[
                  paradedb.boost(10.0,paradedb.match(field=>'name',value=>${filters.query},distance=>2)),
                  paradedb.boost(1.0,paradedb.match(field=>'description',value=>${filters.query},distance=>1)),
                  paradedb.boost(5.0,paradedb.match(field=>'location',value=>${filters.query},distance=>1))
                ])`,
              );
            }

            if (signedIn && userId) {
              // filters.clubs
              if (filters.clubs === 'following') {
                conditions.push(
                  joinedClubsSubquery
                    ? exists(joinedClubsSubquery)
                    : sql<boolean>`false`,
                );
              } else if (filters.clubs === 'new') {
                conditions.push(
                  joinedClubsSubquery
                    ? notExists(joinedClubsSubquery)
                    : sql<boolean>`false`,
                );
              }

              // filters.hideRegistered
              if (filters.hideRegistered) {
                conditions.push(
                  registeredEventsSubquery
                    ? notExists(registeredEventsSubquery)
                    : sql<boolean>`false`,
                );
              }
            }

            return and(...conditions);
          })
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .orderBy((tables) => {
            const events = tables.events;

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
          });

        const result = await query;

        const eventsData = result.map((r) => ({ ...r.events, club: r.club! }));
        const totalCount = result[0]?.['internal-count'] ?? 0;
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
          data: eventsData,
          pagination: {
            page: Math.min(page, totalPages + 1),
            size: pageSize,
            total: totalCount,
            totalPages: totalPages,
          },
        };
      } catch (e) {
        console.error(e);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
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
});

export default eventPublicRouter;
