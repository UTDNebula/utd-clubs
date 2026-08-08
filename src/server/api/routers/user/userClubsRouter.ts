import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { SelectUserMetadataToClubsWithClub } from '@/server/db/models';
import { userMetadataToClubs } from '@/server/db/schema/users';
import { createTRPCRouter, authedProcedure, publicProcedure } from '@/server/api/trpc';
import { byIdSchema, joinLeaveSchema } from '../club/schemas';

const userClubsRouter = createTRPCRouter({
  getMemberClubsMetadata: authedProcedure.query(
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
  getMemberClubs: authedProcedure.query(async ({ ctx }) => {
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
  getOfficerClubs: authedProcedure.query(async ({ ctx }) => {
    const results = await ctx.db.query.userMetadataToClubs.findMany({
      where: and(
        eq(userMetadataToClubs.userId, ctx.session.user.id),
        inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
      ),
      with: { club: true },
    });
    return results.map((ele) => ele.club);
  }),
  isOfficer: authedProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
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
  joinLeave: authedProcedure
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
      if (dataExists) {
        if (dataExists.memberType !== 'President') {
          await ctx.db
            .delete(userMetadataToClubs)
            .where(
              and(
                eq(userMetadataToClubs.userId, joinUserId),
                eq(userMetadataToClubs.clubId, clubId),
              ),
            );
        } else {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot remove yourself because you are an admin',
          });
        }
      } else {
        await ctx.db
          .insert(userMetadataToClubs)
          .values({ userId: joinUserId, clubId, joinedAt: new Date() });
      }
      return dataExists;
    }),
});

export default userClubsRouter;
