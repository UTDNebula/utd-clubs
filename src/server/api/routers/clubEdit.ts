import { TRPCError } from '@trpc/server';
import { and, asc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@src/server/db';
import { selectContact } from '@src/server/db/models';
import { club } from '@src/server/db/schema/club';
import { contacts } from '@src/server/db/schema/contacts';
import { membershipForms } from '@src/server/db/schema/membershipForms';
import { officers } from '@src/server/db/schema/officers';
import { userMetadataToClubs } from '@src/server/db/schema/users';
import { editClubDetailsSchema, editSlugSchema } from '@src/utils/formSchemas';
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
  modified: selectContact.omit({ displayOrder: true }).array(),
  created: selectContact.omit({ clubId: true, displayOrder: true }).array(),
  order: selectContact.shape.platform.array().optional(),
});

export const editCollaboratorSchema = z.object({
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
      id: z.string().optional(),
      name: z.string(),
      position: z.string(),
    })
    .array(),
  order: z.string().array().optional(),
});

const editFormSchema = z.object({
  clubId: z.string(),
  deleted: z.string().array(),
  modified: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.url(),
    })
    .array(),
  created: z
    .object({
      name: z.string(),
      url: z.url(),
    })
    .array(),
  order: z.string().array().optional(),
});

const deleteSchema = z.object({ id: z.string() });

export const removeMembersSchema = z.object({
  clubId: z.string(),
  ids: z.union([z.string().default(''), z.string().default('').array()]),
});

export const clubEditRouter = createTRPCRouter({
  data: protectedProcedure
    .input(editClubDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.id);
      if (!isOfficer) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const updatedClub = await ctx.db
        .update(club)
        .set({
          name: input.name,
          alias: input.alias,
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
      const original = await ctx.db
        .select()
        .from(officers)
        .where(eq(officers.clubId, input.clubId))
        .orderBy(asc(officers.displayOrder));
      let nextFreeDisplayOrder =
        original.findLast((item) => item.displayOrder !== null)?.displayOrder ??
        -1;
      if (input.created.length) {
        await ctx.db
          .insert(contacts)
          .values(
            input.created.map((contact) => ({
              clubId: input.clubId,
              platform: contact.platform,
              url: contact.url,
              displayOrder:
                input.order?.indexOf(contact.platform) ??
                ++nextFreeDisplayOrder,
            })),
          )
          .onConflictDoNothing();
      }

      // Display order
      if (input.order?.length) {
        const promises: Promise<unknown>[] = [];
        input.order.forEach((platform, index) => {
          const promise = ctx.db
            .update(contacts)
            .set({ displayOrder: index })
            .where(
              and(
                eq(contacts.clubId, input.clubId),
                eq(contacts.platform, platform),
              ),
            );
          promises.push(promise);
        });
        await Promise.allSettled(promises);
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
        orderBy: (contacts, { asc }) => asc(contacts.displayOrder),
      });
      return newContacts;
    }),
  officers: protectedProcedure
    .input(editCollaboratorSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.clubId);
      if (!isOfficer) {
        throw new TRPCError({
          message: 'You must be an officer to modify this club',
          code: 'UNAUTHORIZED',
        });
      }
      const isPresident = await isUserPresident(
        ctx.session.user.id,
        input.clubId,
      );
      if (!isPresident && (input.deleted.length || input.modified.length)) {
        throw new TRPCError({
          message: 'Only an admin can remove or modify people',
          code: 'UNAUTHORIZED',
        });
      }
      if (input.deleted.includes(ctx.session.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot remove yourself',
        });
      }
      if (input.modified.some((ele) => ele.userId === ctx.session.user.id)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot promote or demote yourself',
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
        with: { userMetadata: { with: { user: true } } },
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
      const original = await ctx.db
        .select()
        .from(officers)
        .where(eq(officers.clubId, input.clubId))
        .orderBy(asc(officers.displayOrder));
      let nextFreeDisplayOrder =
        original.findLast((item) => item.displayOrder !== null)?.displayOrder ??
        -1;
      if (input.created.length) {
        await ctx.db.insert(officers).values(
          input.created.map((officer) => ({
            clubId: input.clubId,
            name: officer.name,
            position: officer.position,
            displayOrder:
              (officer.id !== undefined
                ? input.order?.indexOf(officer.id)
                : null) ?? ++nextFreeDisplayOrder,
          })),
        );
      }

      // Display order
      if (input.order?.length) {
        const promises: Promise<unknown>[] = [];
        input.order.forEach((id, index) => {
          const promise = ctx.db
            .update(officers)
            .set({ displayOrder: index })
            .where(and(eq(officers.clubId, input.clubId), eq(officers.id, id)));
          promises.push(promise);
        });
        await Promise.allSettled(promises);
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
        orderBy: (officers, { asc }) => asc(officers.displayOrder),
      });
      return newListedOfficers;
    }),

  membershipForms: protectedProcedure
    .input(editFormSchema)
    .mutation(async ({ input, ctx }) => {
      const isOfficer = await isUserOfficer(ctx.session.user.id, input.clubId);
      if (!isOfficer) {
        throw new TRPCError({
          message: 'Must be an officer to modify this club',
          code: 'UNAUTHORIZED',
        });
      }

      // deletions
      if (input.deleted.length) {
        await ctx.db
          .delete(membershipForms)
          .where(
            and(
              eq(membershipForms.clubId, input.clubId),
              inArray(membershipForms.id, input.deleted),
            ),
          );
      }

      // modifications
      const modifyPromises: Promise<unknown>[] = [];
      for (const modded of input.modified) {
        const prom = ctx.db
          .update(membershipForms)
          .set({
            name: modded.name,
            url: modded.url,
          })
          .where(
            and(
              eq(membershipForms.id, modded.id),
              eq(membershipForms.clubId, input.clubId),
            ),
          );
        modifyPromises.push(prom);
      }
      await Promise.allSettled(modifyPromises);

      // add at the end
      const original = await ctx.db
        .select()
        .from(membershipForms)
        .where(eq(membershipForms.clubId, input.clubId))
        .orderBy(asc(membershipForms.displayOrder));

      let nextFreeDisplayOrder =
        original.findLast((item) => item.displayOrder !== null)?.displayOrder ??
        -1;

      if (input.created.length) {
        await ctx.db.insert(membershipForms).values(
          input.created.map((form) => ({
            clubId: input.clubId,
            name: form.name,
            url: form.url,
            displayOrder: ++nextFreeDisplayOrder,
          })),
        );
      }

      // ordering
      if (input.order?.length) {
        const orderPromises: Promise<unknown>[] = [];
        input.order.forEach((id, index) => {
          const promise = ctx.db
            .update(membershipForms)
            .set({ displayOrder: index })
            .where(
              and(
                eq(membershipForms.clubId, input.clubId),
                eq(membershipForms.id, id),
              ),
            );
          orderPromises.push(promise);
        });
        await Promise.allSettled(orderPromises);
      }

      // updatedAt timestamp should change to now
      await ctx.db
        .update(club)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.clubId));

      const newForms = await ctx.db.query.membershipForms.findMany({
        where: eq(membershipForms.clubId, input.clubId),
        orderBy: (membershipForms, { asc }) =>
          asc(membershipForms.displayOrder),
      });

      return newForms;
    }),
  slug: protectedProcedure
    .input(editSlugSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(ctx.session.user.id, input.id);
      if (!isPresident) {
        throw new TRPCError({
          message: 'only a president can remove or modify people',
          code: 'UNAUTHORIZED',
        });
      }

      const bySlug = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.slug, input.slug),
      });
      if (input.slug === 'create' || typeof bySlug !== 'undefined') {
        return null;
      }

      await ctx.db
        .update(club)
        .set({
          slug: input.slug,
        })
        .where(and(eq(club.id, input.id)));

      return input.slug;
    }),
  delete: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(ctx.session.user.id, input.id);
      if (!isPresident) throw new TRPCError({ code: 'UNAUTHORIZED' });

      await callStorageAPI('DELETE', `${input.id}-profile`);
      await callStorageAPI('DELETE', `${input.id}-banner`);
      await ctx.db.delete(club).where(eq(club.id, input.id));
    }),
  markDeleted: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(ctx.session.user.id, input.id);
      if (!isPresident) throw new TRPCError({ code: 'UNAUTHORIZED' });

      await ctx.db
        .update(club)
        .set({
          approved: 'deleted',
        })
        .where(and(eq(club.id, input.id), eq(club.approved, 'approved')));
    }),
  restore: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(ctx.session.user.id, input.id);
      if (!isPresident) throw new TRPCError({ code: 'UNAUTHORIZED' });

      await ctx.db
        .update(club)
        .set({
          approved: 'approved',
        })
        .where(eq(club.id, input.id));
    }),
  removeMembers: protectedProcedure
    .input(removeMembersSchema)
    .mutation(async ({ input, ctx }) => {
      const isPresident = await isUserPresident(
        ctx.session.user.id,
        input.clubId,
      );
      if (!isPresident)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be a club admin to remove members',
        });

      if (
        Array.isArray(input.ids)
          ? input.ids.includes(ctx.session.user.id)
          : ctx.session.user.id == input.ids
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot remove yourself',
        });
      }

      const result = await ctx.db
        .delete(userMetadataToClubs)
        .where(
          and(
            eq(userMetadataToClubs.clubId, input.clubId),
            Array.isArray(input.ids)
              ? inArray(userMetadataToClubs.userId, input.ids)
              : eq(userMetadataToClubs.userId, input.ids),
          ),
        );

      if (result.rowCount === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User was not found in club`,
        });
      }

      // Return new members
      const newMembers = await ctx.db.query.userMetadataToClubs.findMany({
        where: eq(userMetadataToClubs.clubId, input.clubId),
        with: { userMetadata: { with: { user: true } } },
      });
      return newMembers;
    }),
});
