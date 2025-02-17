import { eq, ilike, sql, and, notInArray, inArray, lt, gt } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { clubEditRouter } from './clubEdit';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { club, usedTags } from '@src/server/db/schema/club';
import { contacts } from '@src/server/db/schema/contacts';
import { carousel } from '@src/server/db/schema/admin';
import { officers as officersTable } from '@src/server/db/schema/officers';
import { createClubSchema as baseClubSchema } from '@src/utils/formSchemas';
const byNameSchema = z.object({
  name: z.string().default(''),
});

const byIdSchema = z.object({
  id: z.string().default(''),
});

const joinLeaveSchema = z.object({
  clubId: z.string().default(''),
});

const allSchema = z.object({
  tag: z.string().nullish(),
  cursor: z.number().min(0).default(0),
  limit: z.number().min(1).max(50).default(10),
  initialCursor: z.number().min(0).default(0),
});
const createClubSchema = baseClubSchema
  .omit({ clubId: true, officers: true })
  .extend({
    officers: z
      .object({
        id: z.string().min(1),
        position: z.string(),
        president: z.boolean(),
      })
      .array()
      .min(1),
  });

export const clubRouter = createTRPCRouter({
  edit: clubEditRouter,
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name } = input;
    const clubs = await ctx.db.query.club.findMany({
      where: (club) =>
        and(ilike(club.name, `%${name}%`), eq(club.approved, 'approved')),
    });

    if (name === '') return clubs;

    return clubs.slice(0, 5);
  }),
  byNameNoLimit: publicProcedure
    .input(byNameSchema)
    .query(async ({ input, ctx }) => {
      const { name } = input;
      const clubs = await ctx.db.query.club.findMany({
        where: (club) =>
          and(ilike(club.name, `%${name}%`), eq(club.approved, 'approved')),
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
    const userID = ctx.session?.user.id;
    try {
      let query = ctx.db
        .select()
        .from(club)
        .limit(input.limit)
        .orderBy(club.name)
        .offset(input.cursor)
        .where(eq(club.approved, 'approved'));

      if (userID) {
        const joinedClubs = ctx.db
          .select({ clubId: userMetadataToClubs.clubId })
          .from(userMetadataToClubs)
          .where(eq(userMetadataToClubs.userId, userID));

        query = query.where(notInArray(club.id, joinedClubs));
      }

      if (input.tag && input.tag !== 'All') {
        query = query.where(sql`${input.tag} = ANY(${club.tags})`);
      }

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
      const tags = (await ctx.db.select().from(usedTags)).map(
        (obj) => obj.tags,
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
      const res = await ctx.db
        .insert(club)
        .values({
          name: input.name,
          description: input.description,
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

      await ctx.db.insert(userMetadataToClubs).values(
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
      );
      return clubId;
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
  getCarousel: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const currentItems = await ctx.db.query.carousel.findMany({
      where: and(lt(carousel.startTime, now), gt(carousel.endTime, now)),
      with: { club: true },
    });

    return currentItems;
  }),
  getDirectoryInfo: publicProcedure
    .input(byIdSchema)
    .query(async ({ input: { id }, ctx }) => {
      try {
        const byId = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.id, id),
          with: {
            contacts: true,
            officers: true,
          },
        });
        return byId;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
});
