import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@src/server/db';
import { selectContact } from '@src/server/db/models';
import { club } from '@src/server/db/schema/club';
import { contacts } from '@src/server/db/schema/contacts';
import { officers } from '@src/server/db/schema/officers';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { editClubSchema } from '@src/utils/formSchemas';
import { callStorageAPI } from '@src/utils/storage';
import { createTRPCRouter, protectedProcedure } from '../trpc';

async function isUserOfficer(userId: string, clubId: string) {
  const officer = await db.query.userMetadataToClubs.findFirst({
    where: (userMetadataToClubs) =>
      and(
        eq(userMetadataToClubs.userId, userId),
        eq(userMetadataToClubs.clubId, clubId),
      ),
  });
  if (!officer || !officer.memberType) return false;
  return officer.memberType !== 'Member';
}
async function isUserPresident(userId: string, clubId: string) {
  const officer = await db.query.userMetadataToClubs.findFirst({
    where: (userMetadataToClubs) =>
      and(
        eq(userMetadataToClubs.userId, userId),
        eq(userMetadataToClubs.clubId, clubId),
      ),
  });
  return officer?.memberType == 'President';
}
const editContactSchema = z.object({
  clubId: z.string(),
  deleted: selectContact.shape.platform.array(),
  modified: selectContact.array(),
  created: selectContact.omit({ clubId: true }).array(),
});
const editCollaboratorSchema = z.object({
  clubId: z.string(),
  deleted: z.string().array(),
  modified: z
    .object({
      userId: z.string(),
      position: z.enum(['President', 'Officer']),
    })
    .array(),
  created: z
    .object({
      userId: z.string(),
      position: z.enum(['President', 'Officer']),
    })
    .array(),
});

const editOfficerSchema = z.object({
  clubId: z.string(),
  deleted: z.string().array(),
  modified: z
    .object({
      id: z.string(),
      name: z.string(),
      position: z.string(),
    })
    .array(),
  created: z
    .object({
      name: z.string(),
      position: z.string(),
    })
    .array(),
});
const deleteSchema = z.object({ clubId: z.string() });

export const clubEditRouter = createTRPCRouter({
  data: protectedProcedure
    .input(editClubSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.id);
      if (!isOfficer) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const updatedClub = await ctx.db
        .update(club)
        .set({
          name: input.name,
          description: input.description,
          tags: input.tags,
          profileImage: input.profileImage,
          bannerImage: input.bannerImage,
          foundingDate: input.foundingDate,
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.id))
        .returning();

      return updatedClub[0];
    }),
  contacts: protectedProcedure
    .input(editContactSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.clubId);
      if (!isOfficer)
        throw new TRPCError({
          message: 'must be an officer to modify this club',
          code: 'UNAUTHORIZED',
        });

      // Deleted
      if (input.deleted.length) {
        await ctx.db
          .delete(contacts)
          .where(
            and(
              eq(contacts.clubId, input.clubId),
              inArray(contacts.platform, input.deleted),
            ),
          );
      }

      // Modified
      const promises: Promise<unknown>[] = [];
      for (const modded of input.modified) {
        const prom = ctx.db
          .update(contacts)
          .set({ url: modded.url })
          .where(
            and(
              eq(contacts.clubId, modded.clubId),
              eq(contacts.platform, modded.platform),
            ),
          );
        promises.push(prom);
      }
      await Promise.allSettled(promises);

      // Created
      if (input.created.length) {
        await ctx.db
          .insert(contacts)
          .values(
            input.created.map((contact) => ({
              clubId: input.clubId,
              platform: contact.platform,
              url: contact.url,
            })),
          )
          .onConflictDoNothing();
      }

      // Updated at
      await ctx.db
        .update(club)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.clubId));

      // Return new contacts
      const newContacts = await ctx.db.query.contacts.findMany({
        where: eq(contacts.clubId, input.clubId),
      });
      return newContacts;
    }),
  officers: protectedProcedure
    .input(editCollaboratorSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.clubId);
      if (!isOfficer) {
        throw new TRPCError({
          message: 'must be an officer to modify this club',
          code: 'UNAUTHORIZED',
        });
      }
      const isPresident = await isUserPresident(
        ctx.session.user.id,
        input.clubId,
      );
      if (!isPresident && (input.deleted.length || input.modified.length)) {
        throw new TRPCError({
          message: 'only a president can remove or modify people',
          code: 'UNAUTHORIZED',
        });
      }

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
  listedOfficers: protectedProcedure
    .input(editOfficerSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.clubId);
      if (!isOfficer) {
        throw new TRPCError({
          message: 'must be an officer to modify this club',
          code: 'UNAUTHORIZED',
        });
      }

      // Deleted
      if (input.deleted.length) {
        await ctx.db
          .delete(officers)
          .where(
            and(
              eq(officers.clubId, input.clubId),
              inArray(officers.id, input.deleted),
            ),
          );
      }

      // Modified
      const promises: Promise<unknown>[] = [];
      for (const modded of input.modified) {
        const prom = ctx.db
          .update(officers)
          .set({
            name: modded.name,
            position: modded.position,
          })
          .where(
            and(eq(officers.id, modded.id), eq(officers.clubId, input.clubId)),
          );
        promises.push(prom);
      }
      await Promise.allSettled(promises);

      // Created
      if (input.created.length) {
        await ctx.db.insert(officers).values(
          input.created.map((officer) => ({
            clubId: input.clubId,
            name: officer.name,
            position: officer.position,
          })),
        );
      }

      // Updated at
      await ctx.db
        .update(club)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.clubId));

      // Return new officers
      const newListedOfficers = await ctx.db.query.officers.findMany({
        where: eq(officers.clubId, input.clubId),
      });
      return newListedOfficers;
    }),
  delete: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(
        ctx.session.user.id,
        input.clubId,
      );
      if (!isPresident) throw new TRPCError({ code: 'UNAUTHORIZED' });

      await callStorageAPI('DELETE', `${input.clubId}-profile`);
      await callStorageAPI('DELETE', `${input.clubId}-banner`);

      await ctx.db.delete(club).where(eq(club.id, input.clubId));
    }),
});
