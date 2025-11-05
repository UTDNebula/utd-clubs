import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { club } from '@src/server/db/schema/club';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { adminProcedure, createTRPCRouter } from '../trpc';

const deleteSchema = z.object({
  id: z.string(),
});

const updateOfficer = z.object({
  officerId: z.string(),
  clubId: z.string(),
  role: z.enum(['President', 'Officer', 'Member']),
});

const changeClubStatusSchema = z.object({
  clubId: z.string(),
  status: z.enum(['approved', 'pending', 'rejected']),
});

export const adminRouter = createTRPCRouter({
  allClubs: adminProcedure.query(async ({ ctx }) => {
    const orgs = await ctx.db.query.club.findMany({
      columns: {
        id: true,
        slug: true,
        name: true,
        foundingDate: true,
        tags: true,
        approved: true,
        profileImage: true,
        soc: true,
      },
    });
    return orgs;
  }),
  deleteClub: adminProcedure
    .input(deleteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(club).where(eq(club.id, input.id));
    }),
  updateOfficer: adminProcedure
    .input(updateOfficer)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMetadataToClubs)
        .set({ memberType: input.role })
        .where(
          and(
            eq(userMetadataToClubs.clubId, input.clubId),
            eq(userMetadataToClubs.userId, input.officerId),
          ),
        );
    }),
  addOfficer: adminProcedure
    .input(updateOfficer)
    .mutation(async ({ ctx, input }) => {
      // Make sure the user is not already an officer
      const exists = await ctx.db.query.userMetadataToClubs.findFirst({
        where: (userMetadataToClubs) =>
          and(
            eq(userMetadataToClubs.clubId, input.clubId),
            eq(userMetadataToClubs.userId, input.officerId),
          ),
      });

      if (exists) {
        await ctx.db
          .update(userMetadataToClubs)
          .set({ memberType: input.role })
          .where(
            and(
              eq(userMetadataToClubs.clubId, input.clubId),
              eq(userMetadataToClubs.userId, input.officerId),
            ),
          );
        return;
      }
      await ctx.db.insert(userMetadataToClubs).values({
        clubId: input.clubId,
        userId: input.officerId,
        memberType: input.role,
      });
    }),
  changeClubStatus: adminProcedure
    .input(changeClubStatusSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(club)
        .set({ approved: input.status })
        .where(eq(club.id, input.clubId));
    }),
});
