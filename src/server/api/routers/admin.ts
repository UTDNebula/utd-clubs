import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { club } from '@src/server/db/schema/club';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { adminProcedure, createTRPCRouter } from '../trpc';
import { editCollaboratorSchema } from './clubEdit';

const bySlugSchema = z.object({
  slug: z.string().default(''),
});

const deleteSchema = z.object({
  id: z.string(),
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
        foundingDate: false,
        tags: true,
        approved: true,
        profileImage: false,
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
  updateOfficers: adminProcedure
    .input(editCollaboratorSchema)
    .mutation(async ({ ctx, input }) => {
      // Deleted
      if (input.deleted.length) {
        await ctx.db
          .insert(userMetadataToClubs)
          .values(
            input.deleted.map((officer) => ({
              userId: officer,
              clubId: input.clubId,
              memberType: 'Member' as const,
            })),
          )
          .onConflictDoUpdate({
            target: [userMetadataToClubs.userId, userMetadataToClubs.clubId],
            set: { memberType: 'Member' as const },
            where: inArray(userMetadataToClubs.memberType, [
              'Officer',
              'President',
            ]),
          });
      }

      // Modified
      const promises: Promise<unknown>[] = [];
      for (const modded of input.modified) {
        const prom = ctx.db
          .update(userMetadataToClubs)
          .set({
            memberType: modded.position,
          })
          .where(
            and(
              eq(userMetadataToClubs.userId, modded.userId),
              eq(userMetadataToClubs.clubId, input.clubId),
            ),
          );
        promises.push(prom);
      }
      await Promise.allSettled(promises);

      // Created
      if (input.created.length) {
        await ctx.db
          .insert(userMetadataToClubs)
          .values(
            input.created.map((officer) => ({
              userId: officer.userId,
              clubId: input.clubId,
              memberType: officer.position,
            })),
          )
          .onConflictDoUpdate({
            target: [userMetadataToClubs.userId, userMetadataToClubs.clubId],
            set: { memberType: 'Officer' as const },
            where: eq(userMetadataToClubs.memberType, 'Member'),
          });
      }

      // Updated at
      await ctx.db
        .update(club)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.clubId));

      // Return new officers
      const newOfficers = await ctx.db.query.userMetadataToClubs.findMany({
        where: and(
          eq(userMetadataToClubs.clubId, input.clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
        with: { userMetadata: true },
      });
      return newOfficers;
    }),
  changeClubStatus: adminProcedure
    .input(changeClubStatusSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(club)
        .set({ approved: input.status })
        .where(eq(club.id, input.clubId));
    }),
  getDirectoryInfo: adminProcedure
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
});
