import { and, eq, gt } from 'drizzle-orm';
import { type DateRange } from 'react-day-picker';
import { z } from 'zod';
import { carousel } from '@src/server/db/schema/admin';
import { club } from '@src/server/db/schema/club';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { adminProcedure, createTRPCRouter } from '../trpc';

function isDateRange(value: unknown): value is DateRange {
  return Boolean(value && typeof value === 'object' && 'from' in value);
}

const deleteSchema = z.object({
  id: z.string(),
});

const updateOfficer = z.object({
  officerId: z.string(),
  clubId: z.string(),
  role: z.enum(['President', 'Officer', 'Member']),
});

const carouselSchema = z.object({
  orgId: z.string(),
  range: z.custom<DateRange>((val) => isDateRange(val)),
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
        clubSearchVector: false,
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
  upcomingCarousels: adminProcedure.query(async ({ ctx }) => {
    const carousels = await ctx.db.query.carousel.findMany({
      where: (carousel) => gt(carousel.startTime, new Date()),
      orderBy: (carousel) => carousel.startTime,
      with: {
        club: true,
      },
    });

    return carousels;
  }),
  addClubCarousel: adminProcedure
    .input(carouselSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.range.from || !input.range.to)
        throw new Error('Invalid date range');

      // Check if there is already a carousel for this club
      const exists = await ctx.db.query.carousel.findFirst({
        where: (carousel) => eq(carousel.orgId, input.orgId),
      });

      if (exists) {
        await ctx.db
          .update(carousel)
          .set({
            startTime: input.range.from,
            endTime: input.range.to,
          })
          .where(eq(carousel.orgId, input.orgId));
        return;
      }
      await ctx.db.insert(carousel).values({
        orgId: input.orgId,
        startTime: input.range.from,
        endTime: input.range.to,
      });
    }),
  removeClubCarousel: adminProcedure
    .input(deleteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(carousel).where(eq(carousel.orgId, input.id));
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
