import {
  and,
  arrayContains,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import {
  authedProcedure,
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc';
import { club, usedTags } from '@/server/db/schema/club';
import { membershipForms } from '@/server/db/schema/membershipForms';
import { officers as officersTable } from '@/server/db/schema/officers';
import { userMetadataToClubs } from '@/server/db/schema/users';
import { clubIdSchema, clubSlugSchema } from '../baseSchemas';
import { byNameSchema, searchSchema, searchTagSchema } from './inputSchemas';

const clubPublicRouter = createTRPCRouter({
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
  byId: publicProcedure.input(clubIdSchema).query(async ({ input, ctx }) => {
    const { clubId } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, clubId),
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
  bySlug: publicProcedure
    .input(clubSlugSchema)
    .query(async ({ input, ctx }) => {
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
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.db
        .select()
        .from(club)
        .orderBy(club.name)
        .where(eq(club.approved, 'approved'));

      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  distinctTags: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db
        .select()
        .from(usedTags)
        .orderBy(desc(usedTags.count), asc(usedTags.tag));
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  topTags: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db
        .select()
        .from(usedTags)
        .orderBy(desc(usedTags.count), asc(usedTags.tag))
        .limit(5);
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  getOfficers: authedProcedure
    .input(clubIdSchema)
    .query(async ({ input, ctx }) => {
      const officers = await ctx.db.query.userMetadataToClubs.findMany({
        where: and(
          eq(userMetadataToClubs.clubId, input.clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
        with: { userMetadata: { with: { user: true } } },
      });
      return officers;
    }),
  getListedOfficers: publicProcedure
    .input(clubIdSchema)
    .query(async ({ input, ctx }) => {
      const officers = await ctx.db.query.officers.findMany({
        where: eq(officersTable.clubId, input.clubId),
      });
      return officers.sort(
        // Infinity makes items without a `displayOrder` go to the end
        (a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity),
      );
    }),
  getMembers: publicProcedure
    .input(clubIdSchema)
    .query(async ({ input, ctx }) => {
      const members = await ctx.db.query.userMetadataToClubs.findMany({
        where: eq(userMetadataToClubs.clubId, input.clubId),
        with: { userMetadata: { with: { user: true } } },
      });
      return members;
    }),
  isActive: publicProcedure
    .input(clubIdSchema)
    .query(async ({ input, ctx }) => {
      const hasPresident = await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.clubId, input.clubId),
          eq(userMetadataToClubs.memberType, 'President'),
        ),
      });
      return !!hasPresident;
    }),
  getDirectoryInfo: publicProcedure
    .input(clubSlugSchema)
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
    .input(clubSlugSchema)
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
    .input(clubIdSchema)
    .query(async ({ input: { clubId }, ctx }) => {
      try {
        const byId = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.id, clubId),
        });
        return byId?.slug;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  tagSearch: publicProcedure
    .input(searchTagSchema)
    .query(async ({ input, ctx }) => {
      const searchTerm = input.search.trim();
      if (!searchTerm) {
        return { tags: [], clubs: [] };
      }

      const tags = await ctx.db
        .select({ tag: usedTags.tag })
        .from(usedTags)
        .where(ilike(usedTags.tag, `%${searchTerm}%`))
        .orderBy(asc(usedTags.tag))
        .limit(5);
      return { tags: tags, clubs: [] };
    }),
  search: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    try {
      const searchTerm = input.search?.trim();
      const hasSearch = Boolean(searchTerm);
      const query = ctx.db
        .select()
        .from(club)
        .limit(input.limit)
        .offset(input.cursor)
        .where(
          and(
            hasSearch
              ? sql`${club.searchTsv} @@ websearch_to_tsquery('english', ${searchTerm})`
              : undefined,
            eq(club.approved, 'approved'),
            input.tags && input.tags.length > 0
              ? arrayContains(club.tags, input.tags)
              : undefined,
          ),
        )
        .orderBy(
          ...(hasSearch
            ? [
                sql`${club.searchTsv} <@> to_bm25query(to_tsvector('english', ${searchTerm}), 'club_search_idx') ASC`,
              ]
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
  details: publicProcedure.input(clubIdSchema).query(async ({ input, ctx }) => {
    const { clubId } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, clubId),
        columns: {
          id: true,
          name: true,
          alias: true,
          description: true,
          foundingDate: true,
          tags: true,
          profileImage: true,
          bannerImage: true,
          clubSize: true,
          updatedAt: true,
          schools: true,
        },
      });

      return byId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  clubForms: publicProcedure
    .input(clubIdSchema)
    .query(async ({ input, ctx }) => {
      try {
        const forms = await ctx.db
          .select()
          .from(membershipForms)
          .where(eq(membershipForms.clubId, input.clubId));
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

export default clubPublicRouter;
