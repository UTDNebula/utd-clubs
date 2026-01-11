import { TRPCError } from '@trpc/server';
import { and, desc, eq, inArray, lte } from 'drizzle-orm';
import { z } from 'zod';
import { club } from '@src/server/db/schema/club';
import { events } from '@src/server/db/schema/events';
import {
  userMetadataToClubs,
  userMetadataToEvents,
} from '@src/server/db/schema/users';
import { callStorageAPI } from '@src/utils/storage';
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
  status: z.enum(club.approved.enumValues),
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
      await callStorageAPI('DELETE', `${input.id}-profile`);
      await callStorageAPI('DELETE', `${input.id}-banner`);
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

      // Return new officers
      const newOfficers = await ctx.db.query.userMetadataToClubs.findMany({
        where: and(
          eq(userMetadataToClubs.clubId, input.clubId),
          inArray(userMetadataToClubs.memberType, ['Officer', 'President']),
        ),
        with: { userMetadata: { with: { user: true } } },
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
        // Fetch club by slug
        const bySlug = await ctx.db.query.club.findFirst({
          where: (club) => eq(club.slug, slug),
          with: {
            contacts: true,
            officers: true,
            userMetadataToClubs: {
              columns: {
                userId: true, // Only fetch the ID to keep the payload small
              },
            },
          },
        });

        if (!bySlug) return null;

        // Fetch latest event date
        const lastEvent = await ctx.db.query.events.findFirst({
          where: (events) =>
            and(
              eq(events.clubId, bySlug.id),
              lte(events.startTime, new Date()),
            ), // find the end time of events that have started before now
          orderBy: (events) => [desc(events.endTime)],
          columns: {
            endTime: true,
          },
        });

        const { userMetadataToClubs, ...clubData } = bySlug; // clubData doesn't have userMetadataToClubs field
        return {
          ...clubData,
          numMembers: userMetadataToClubs.length,
          lastEventDate: lastEvent?.endTime ?? null,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),
  deleteEvent: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const event = await ctx.db.query.events.findFirst({
        where: (e) => eq(e.id, input.id),
      });

      if (!event) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found' });
      }

      await callStorageAPI('DELETE', `${event.clubId}-event-${event.id}`);

      await ctx.db
        .delete(userMetadataToEvents)
        .where(eq(userMetadataToEvents.eventId, input.id));
      await ctx.db.delete(events).where(eq(events.id, input.id));

      return { success: true };
    }),
});
