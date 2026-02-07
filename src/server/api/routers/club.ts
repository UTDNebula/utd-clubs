import { TRPCError } from '@trpc/server';
import {
  and,
  arrayOverlaps,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  lte,
  not,
  or,
  sql,
} from 'drizzle-orm';
import { google } from 'googleapis';
import { z } from 'zod';
import { SelectUserMetadataToClubsWithClub } from '@src/server/db/models';
import { club, usedTags } from '@src/server/db/schema/club';
import { membershipForms } from '@src/server/db/schema/membershipForms';
import { officers as officersTable } from '@src/server/db/schema/officers';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { syncCalendar, watchCalendar } from '@src/utils/calendar';
import { createClubSchema } from '@src/utils/formSchemas';
import { getGoogleAccessToken } from '@src/utils/googleAuth';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../trpc';
import { clubEditRouter } from './clubEdit';

const byNameSchema = z.object({
  name: z.string().default(''),
  limit: z.number().min(1).max(20).default(5),
});

const byIdSchema = z.object({
  id: z.string().default(''),
});

const bySlugSchema = z.object({
  slug: z.string().default(''),
});

const joinLeaveSchema = z.object({
  clubId: z.string().default(''),
});

const tagReplaceSchema = z.object({
  oldTag: z.string(),
  newTag: z.string(),
});
const allSchema = z.object({
  tags: z.string().array().nullish(),
  name: z.string().nullish(),
  cursor: z.number().min(0).default(0),
  limit: z.number().min(1).max(50).default(10),
  initialCursor: z.number().min(0).default(0),
});

const searchSchema = z.object({
  tags: z.string().array().nullish(),
  search: z.string().nullish(),
  cursor: z.number().min(0).default(0),
  limit: z.number().min(1).max(50).default(10),
  initialCursor: z.number().min(0).default(0),
});

const searchTagSchema = z.object({
  search: z.string(),
});

const eventSyncSchema = z.object({
  clubId: z.string(),
  calendarName: z.string().optional(),
  calendarId: z.string().optional(),
});

export const clubRouter = createTRPCRouter({
  edit: clubEditRouter,
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name, limit } = input;
    const clubs = await ctx.db.query.club.findMany({
      where: (club) =>
        and(
          eq(club.approved, 'approved'),
          or(ilike(club.name, `%${name}%`), ilike(club.alias, `%${name}%`)),
        ),
      limit,
    });

    return clubs;
  }),
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, id),
        with: {
          contacts: {
            orderBy: (contacts, { asc }) => asc(contacts.displayOrder),
          },
        },
      });

      return byId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  bySlug: publicProcedure.input(bySlugSchema).query(async ({ input, ctx }) => {
    const { slug } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.slug, slug),
        with: {
          contacts: {
            orderBy: (contacts, { asc }) => asc(contacts.displayOrder),
          },
        },
      });

      return byId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  all: publicProcedure.input(allSchema).query(async ({ ctx, input }) => {
    try {
      const query = ctx.db
        .select()
        .from(club)
        .limit(input.limit)
        .orderBy(club.name)
        .offset(input.cursor)
        .where(
          and(
            eq(club.approved, 'approved'),
            input.tags && input.tags.length != 0
              ? arrayOverlaps(club.tags, input.tags)
              : undefined,
            input.name ? ilike(club.name, `%${input.name}%`) : undefined,
          ),
        );

      const res = await query.execute();
      const newOffset = input.cursor + res.length;

      return {
        clubs: res,
        cursor: newOffset,
      };
    } catch (e) {
      console.error(e);
      return {
        clubs: [],
        cursor: 0,
      };
    }
  }),
  distinctTags: publicProcedure.query(async ({ ctx }) => {
    try {
      const tags = (await ctx.db.select().from(usedTags)).map((obj) => obj.tag);
      return tags;
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  topTags: publicProcedure.query(async ({ ctx }) => {
    try {
      const tags = (await ctx.db.select().from(usedTags).limit(5)).map(
        (obj) => obj.tag,
      );
      return tags;
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  getMemberClubsMetadata: protectedProcedure.query(
    async ({
      ctx,
    }): Promise<SelectUserMetadataToClubsWithClub[] | undefined> => {
      const results = await ctx.db.query.userMetadataToClubs.findMany({
        where: and(
          eq(userMetadataToClubs.userId, ctx.session.user.id),
          inArray(userMetadataToClubs.memberType, [
            'Member',
            'Officer',
            'President',
          ]),
        ),
        with: { club: true },
      });
      return results;
    },
  ),
  getMemberClubs: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.userMetadataToClubs.findMany({
      where: and(
        eq(userMetadataToClubs.userId, ctx.session.user.id),
        inArray(userMetadataToClubs.memberType, [
          'Member',
          'Officer',
          'President',
        ]),
      ),
      with: { club: true },
    });
    return results.map((ele) => ele.club);
  }),
  getOfficerClubs: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.userMetadataToClubs.findMany({
      where: and(
        eq(userMetadataToClubs.userId, ctx.session.user.id),
        inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
      ),
      with: { club: true },
    });
    return results.map((ele) => ele.club);
  }),
  isOfficer: protectedProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      const found = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.clubId, input.id),
          eq(userMetadataToClubs.userId, ctx.session.user.id),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
      });
      return !!found;
    }),
  memberType: publicProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;
      return (
        (
          await ctx.db.query.userMetadataToClubs.findFirst({
            where: and(
              eq(userMetadataToClubs.clubId, input.id),
              eq(userMetadataToClubs.userId, ctx.session.user.id),
              inArray(userMetadataToClubs.memberType, [
                'Member',
                'Officer',
                'President',
              ]),
            ),
          })
        )?.memberType ?? null
      );
    }),
  memberState: publicProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;

      const result = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.clubId, input.id),
          eq(userMetadataToClubs.userId, ctx.session.user.id),
          inArray(userMetadataToClubs.memberType, [
            'Member',
            'Officer',
            'President',
          ]),
        ),
      });
      return {
        memberType: result?.memberType ?? null,
        joinedAt: result?.joinedAt ?? null,
      };
    }),
  joinLeave: protectedProcedure
    .input(joinLeaveSchema)
    .mutation(async ({ ctx, input }) => {
      const joinUserId = ctx.session.user.id;
      const { clubId } = input;
      const dataExists = await ctx.db.query.userMetadataToClubs.findFirst({
        where: (userMetadataToClubs) =>
          and(
            eq(userMetadataToClubs.userId, joinUserId),
            eq(userMetadataToClubs.clubId, clubId),
          ),
      });
      if (dataExists && dataExists.memberType == 'Member') {
        await ctx.db
          .delete(userMetadataToClubs)
          .where(
            and(
              eq(userMetadataToClubs.userId, joinUserId),
              eq(userMetadataToClubs.clubId, clubId),
            ),
          );
      } else {
        await ctx.db
          .insert(userMetadataToClubs)
          .values({ userId: joinUserId, clubId, joinedAt: new Date() });
      }
      return dataExists;
    }),
  create: protectedProcedure
    .input(createClubSchema)
    .mutation(async ({ input, ctx }) => {
      //Create unique slug based on name
      const baseSlug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const existing = await ctx.db.query.club.findMany({
        where: (club, { like }) => like(club.slug, `${baseSlug}%`),
        columns: { slug: true },
      });
      const existingSlugs = new Set(existing.map((c) => c.slug));
      let slug = baseSlug;
      let counter = 2;
      while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }

      const res = await ctx.db
        .insert(club)
        .values({
          name: input.name,
          description: input.description,
          updatedAt: new Date(),
          slug,
        })
        .returning();

      const clubId = res[0]!.id;

      await ctx.db.insert(userMetadataToClubs).values({
        userId: ctx.session.user.id,
        clubId: clubId,
        memberType: 'President' as const,
      });

      return slug;
    }),
  getOfficers: protectedProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      const officers = await ctx.db.query.userMetadataToClubs.findMany({
        where: and(
          eq(userMetadataToClubs.clubId, input.id),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
        with: { userMetadata: { with: { user: true } } },
      });
      return officers;
    }),
  getListedOfficers: publicProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      const officers = await ctx.db.query.officers.findMany({
        where: eq(officersTable.clubId, input.id),
      });
      return officers.sort(
        // Infinity makes items without a `displayOrder` go to the end
        (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity),
      );
    }),
  getMembers: publicProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      const members = await ctx.db.query.userMetadataToClubs.findMany({
        where: eq(userMetadataToClubs.clubId, input.id),
        with: { userMetadata: { with: { user: true } } },
      });
      return members;
    }),
  isActive: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const hasPresident = await ctx.db.query.userMetadataToClubs.findFirst({
      where: and(
        eq(userMetadataToClubs.clubId, input.id),
        eq(userMetadataToClubs.memberType, 'President'),
      ),
    });
    return !!hasPresident;
  }),
  getDirectoryInfo: publicProcedure
    .input(bySlugSchema)
    .query(async ({ input: { slug }, ctx }) => {
      try {
        // Fetch club by slug
        const bySlug = await ctx.db.query.club.findFirst({
          where: (club) =>
            and(eq(club.slug, slug), eq(club.approved, 'approved')),
          with: {
            userMetadataToClubs: {
              columns: {
                userId: true, // Only fetch the ID to keep the payload small
              },
            },
            contacts: {
              orderBy: (contacts, { asc }) => asc(contacts.displayOrder),
            },
            officers: {
              orderBy: (officers, { asc }) => asc(officers.displayOrder),
            },
          },
        });

        if (!bySlug) return null;

        // Fetch latest event date
        const lastEvent = await ctx.db.query.events.findFirst({
          where: (events) =>
            and(
              eq(events.clubId, bySlug.id),
              eq(events.status, 'approved'),
              lte(events.startTime, new Date()),
            ), // find the time range of events that have started before now
          orderBy: (events) => [desc(events.endTime)],
          columns: {
            startTime: true,
            endTime: true,
          },
        });

        const { userMetadataToClubs, ...clubData } = bySlug; // clubData doesn't have userMetadataToClubs field
        return {
          ...clubData,
          numMembers: userMetadataToClubs.length,
          lastEventDate: lastEvent
            ? lastEvent.endTime // this event already started (at least)
            : null,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  slugExists: publicProcedure
    .input(bySlugSchema)
    .query(async ({ input: { slug }, ctx }) => {
      try {
        if (slug === 'create') {
          return true;
        }
        const bySlug = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.slug, slug),
        });
        return typeof bySlug !== 'undefined';
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  getSlug: publicProcedure
    .input(byIdSchema)
    .query(async ({ input: { id }, ctx }) => {
      try {
        const byId = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.id, id),
        });
        return byId?.slug;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  changeTags: adminProcedure
    .input(tagReplaceSchema)
    .mutation(async ({ input, ctx }) => {
      const clubsToChange = await ctx.db.query.club.findMany({
        where: sql`${input.oldTag} = ANY(tags)`,
      });
      clubsToChange.map((club) => {
        club.tags = club.tags.map((tag) =>
          tag == input.oldTag ? input.newTag : tag,
        );
        return club;
      });
      const clubPromise: Promise<unknown>[] = [];
      for (const clu of clubsToChange) {
        clubPromise.push(
          ctx.db
            .update(club)
            .set({ tags: clu.tags })
            .where(eq(club.id, clu.id)),
        );
      }
      await Promise.all(clubPromise);
      await ctx.db.refreshMaterializedView(usedTags);
      return { affected: clubsToChange.length };
    }),
  tagSearch: publicProcedure
    .input(searchTagSchema)
    .query(async ({ input, ctx }) => {
      const tags = await ctx.db
        .select({ tag: usedTags.tag })
        .from(usedTags)
        .where(sql`${usedTags.tag} @@@ ${input.search}`)
        .orderBy(sql`paradedb.score(${usedTags.id})`)
        .limit(5);
      return { tags: tags, clubs: [] };
    }),
  search: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    try {
      const query = ctx.db
        .select()
        .from(club)
        .limit(input.limit)
        .offset(input.cursor)
        .where(
          and(
            input.search !== ''
              ? sql`id @@@ 
                paradedb.boolean(
                  should =>ARRAY[
                    paradedb.boost(20,paradedb.match('alias',${input.search},distance=>2)),
                    paradedb.boost(10,paradedb.match('name',${input.search},distance=>2)),
                    paradedb.boost(1,paradedb.match('description',${input.search},distance=>1)),
                    paradedb.boost(5,paradedb.match('tags',${input.search},distance=>1))
                  ])`
              : undefined,
            sql`
              id @@@ paradedb.const_score(0.0,
                paradedb.term('approved','approved'::approved_enum))
            `,
            input.tags && input.tags.length != 0
              ? sql.raw(`
                id @@@ paradedb.const_score(0.0,paradedb.boolean(
                  must => ARRAY[
                    ${input.tags.map((tag) => `paradedb.term('tags','${tag}')`).join(',')}
                  ]))`)
              : undefined,
          ),
        )
        .orderBy(
          ...(input.search !== ''
            ? [sql`paradedb.score(id) DESC`]
            : [desc(club.pageViews), asc(club.name)]),
        );

      const res = await query.execute();
      const newOffset = input.cursor + res.length;

      return {
        clubs: res,
        cursor: newOffset,
      };
    } catch (e) {
      console.error(e);
      return {
        clubs: [],
        cursor: 0,
      };
    }
  }),
  eventSync: protectedProcedure
    .input(eventSyncSchema)
    .mutation(async ({ ctx, input }) => {
      const calendarAlreadyUsed = await ctx.db
        .select()
        .from(club)
        .where(
          and(
            eq(club.calendarId, input.calendarId ?? ''),
            not(eq(club.id, input.clubId)),
          ),
        );
      if (calendarAlreadyUsed && calendarAlreadyUsed.length > 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Calendar already selected by a different club',
        });
      }
      const selectedClub = await ctx.db.query.club.findFirst({
        where: eq(club.id, input.clubId),
      });
      if (!selectedClub) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'no club found',
        });
      }

      // this should only happen on resyncs
      if (selectedClub.calendarId && !selectedClub.calendarGoogleAccountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'no connected google account',
        });
      }
      await ctx.db
        .update(club)
        .set({
          calendarId: input.calendarId,
          calendarGoogleAccountId: ctx.session.user.id,
          calendarName: input.calendarName,
          calendarSyncToken: null,
        })
        .where(eq(club.id, input.clubId));
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: await getGoogleAccessToken(
          selectedClub.calendarGoogleAccountId ?? ctx.session.user.id,
        ),
      });
      try {
        const sync = await syncCalendar(input.clubId, false, oauth2Client); // one-time sync
        try {
          await watchCalendar(input.clubId); // create the webhook to sync updates in the future
          return sync;
        } catch (error) {
          // if webhook wasn't established, it's okay because events have synced
          if (
            error &&
            typeof error === 'object' &&
            'message' in error &&
            error.message ===
              'Push notifications are not supported by this resource.'
          ) {
            return { status: 'ONE_TIME_SYNC', data: sync };
          }
          throw error; // if it's not a webhook subscription issue
        }
      } catch (error) {
        console.error(
          'Sync failed, reverting DB changes:',
          (error as { message: string }).message,
        );
        await ctx.db
          .update(club)
          .set({
            calendarId: null,
            calendarGoogleAccountId: null,
            calendarName: null,
            calendarSyncToken: null,
          })
          .where(eq(club.id, input.clubId));

        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          error.status === 404
        ) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Could not find calendar: ${(error as { message?: string }).message || 'Unknown error'}`,
          });
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Could not connect calendar: ${(error as { message?: string }).message || 'Unknown error'}`,
          });
        }
      }
    }),

  details: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, id),
        columns: {
          id: true,
          name: true,
          alias: true,
          description: true,
          foundingDate: true,
          tags: true,
          profileImage: true,
          bannerImage: true,
        },
      });

      return byId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  clubForms: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    try {
      const forms = await ctx.db
        .select()
        .from(membershipForms)
        .where(eq(membershipForms.clubId, input.id));
      forms.sort(
        // Infinity makes items without a `displayOrder` go to the end
        (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity),
      );
      return forms;
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
});
