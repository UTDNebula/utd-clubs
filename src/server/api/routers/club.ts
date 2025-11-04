import {
  and,
  arrayOverlaps,
  eq,
  gt,
  ilike,
  inArray,
  lt,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';
import { club, usedTags } from '@src/server/db/schema/club';
import { contacts } from '@src/server/db/schema/contacts';
import { officers as officersTable } from '@src/server/db/schema/officers';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { createClubSchema as baseClubSchema } from '@src/utils/formSchemas';
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
const createClubSchema = baseClubSchema.omit({ officers: true }).extend({
  officers: z
    .object({
      id: z.string().min(1),
      position: z.string(),
      president: z.boolean(),
    })
    .array()
    .min(1),
});

const searchTagSchema = z.object({
  search: z.string(),
});

export const clubRouter = createTRPCRouter({
  edit: clubEditRouter,
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name, limit } = input;
    const clubs = await ctx.db.query.club.findMany({
      where: (club) =>
        and(ilike(club.name, `%${name}%`), eq(club.approved, 'approved')),
      limit,
    });

    return clubs;
  }),

  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, id),
        with: { contacts: true },
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
      console.log(query.toSQL());

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
      const tags = (await ctx.db.select().from(usedTags).limit(6)).map(
        (obj) => obj.tag,
      );
      return tags;
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  getOfficerClubs: protectedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.userMetadataToClubs.findMany({
      where: and(
        eq(userMetadataToClubs.userId, ctx.session.user.id),
        inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
      ),
      with: { club: true },
    });
    // type wah = NonNullable<(typeof results)[number]['club']>;
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
      if (!ctx.session) return undefined;
      return (
        await ctx.db.query.userMetadataToClubs.findFirst({
          where: and(
            eq(userMetadataToClubs.clubId, input.id),
            eq(userMetadataToClubs.userId, ctx.session.user.id),
            inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
          ),
        })
      )?.memberType;
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
          .values({ userId: joinUserId, clubId });
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
          slug,
        })
        .returning({ id: club.id });

      const clubId = res[0]!.id;

      if (input.contacts.length > 0) {
        await ctx.db.insert(contacts).values(
          input.contacts.map((contact) => {
            return {
              platform: contact.platform,
              url: contact.url,
              clubId: clubId,
            };
          }),
        );
      }

      await ctx.db
        .insert(userMetadataToClubs)
        .values(
          input.officers.map((officer) => {
            return {
              userId: officer.id,
              clubId: clubId,
              memberType: officer.president
                ? ('President' as const)
                : ('Officer' as const),
              title: officer.position,
            };
          }),
        )
        .catch((e) => console.log(e));
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
        with: { userMetadata: true },
      });
      return officers;
    }),
  getListedOfficers: publicProcedure
    .input(byIdSchema)
    .query(async ({ input, ctx }) => {
      const officers = await ctx.db.query.officers.findMany({
        where: eq(officersTable.clubId, input.id),
      });
      return officers;
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
        const bySlug = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.slug, slug),
          with: {
            contacts: true,
            officers: true,
          },
        });
        return bySlug;
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
            sql`
              id @@@ paradedb.const_score(0.0,
                paradedb.term('approved','approved'::approved_enum))
            `,
            input.tags && input.tags.length != 0
              ? sql.raw(`
                id @@@ paradedb.const_score(0.0,paradedb.term_set(
                  terms => ARRAY[
                    ${input.tags.map((tag) => `paradedb.term('tags','${tag}')`).join(',')}
                  ]))`)
              : undefined,
            input.search
              ? sql`id @@@ 
                paradedb.boolean(
                  should =>ARRAY[
                    paradedb.boost(2.0,paradedb.match('name',${input.search},distance=>1)),
                    paradedb.boost(1,paradedb.match('description',${input.search},distance=>1)),
                    paradedb.boost(1.5,paradedb.match('tags',${input.search},distance=>1))
                  ])`
              : undefined,
          ),
        )
        .orderBy(input.search ? sql`paradedb.score(id) DESC` : club.name);
      console.log(query.toSQL());

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
});
