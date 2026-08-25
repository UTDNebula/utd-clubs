import { TRPCError } from '@trpc/server';
import { and, asc, eq, inArray, not } from 'drizzle-orm';
import { google } from 'googleapis';
import { syncCalendar, watchCalendar } from '@/lib/modules/googleCalendar';
import { getGoogleAccessToken } from '@/lib/modules/googleOAuth';
import { callStorageAPI } from '@/lib/utils/storage';
import { authedProcedure, createTRPCRouter } from '@/server/api/trpc';
import { requireMemberRole } from '@/server/api/utils';
import { club } from '@/server/db/schema/club';
import { contacts } from '@/server/db/schema/contacts';
import { membershipForms } from '@/server/db/schema/membershipForms';
import { officers } from '@/server/db/schema/officers';
import { userMetadataToClubs } from '@/server/db/schema/users';
import { clubIdSchema } from '../baseSchemas';
import {
  createSchema,
  editCollaboratorSchema,
  editContactSchema,
  editDataSchema,
  editFormSchema,
  editOfficerSchema,
  editSlugSchema,
  eventSyncSchema,
  removeMembersSchema,
} from './inputSchemas';

const clubManageRouter = createTRPCRouter({
  create: authedProcedure
    .input(createSchema)
    .mutation(async ({ input, ctx }) => {
      //Create unique slug based on name
      const baseSlug = input.name.name
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
          name: input.name.name,
          alias: input.name.alias,
          description: input.meta.description,
          tags: input.meta.tags,
          updatedAt: new Date(),
          slug,
        })
        .returning();

      const clubId = res[0]!.id;

      await ctx.db.insert(userMetadataToClubs).values({
        userId: ctx.session.user.id,
        clubId: clubId,
        memberType: 'President' as const,
      });

      return slug;
    }),
  data: authedProcedure
    .input(editDataSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.id, {
        Officer: { errorMessage: 'Must be an officer to modify this club' },
      });

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
          clubSize: input.clubSize,
          updatedAt: new Date(),
          schools: input.schools,
        })
        .where(eq(club.id, input.id))
        .returning();

      return updatedClub[0];
    }),
  setUpdatedAt: authedProcedure
    .input(clubIdSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: true,
      });

      await ctx.db
        .update(club)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(club.id, input.clubId));

      return { success: true };
    }),
  contacts: authedProcedure
    .input(editContactSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: { errorMessage: 'Must be an officer to modify this club' },
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
  officers: authedProcedure
    .input(editCollaboratorSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: { errorMessage: 'You must be an officer to modify this club' },
        President: {
          errorMessage: 'Only an admin can remove or modify people',
          throwError: Boolean(input.deleted.length || input.modified.length),
        },
      });

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
  listedOfficers: authedProcedure
    .input(editOfficerSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: { errorMessage: 'Must be an officer to modify this club' },
      });

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

  membershipForms: authedProcedure
    .input(editFormSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        Officer: { errorMessage: 'Must be an officer to modify this club' },
      });

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
            displayOrder:
              (form.id !== undefined ? input.order?.indexOf(form.id) : null) ??
              ++nextFreeDisplayOrder,
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
  eventSync: authedProcedure
    .input(eventSyncSchema)
    .mutation(async ({ ctx, input }) => {
      const calendarAlreadyUsed = await ctx.db
        .select()
        .from(club)
        .where(
          and(
            eq(club.calendarId, input.calendarId ?? ''),
            not(eq(club.id, input.clubId)),
          ),
        );
      if (calendarAlreadyUsed && calendarAlreadyUsed.length > 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Calendar already selected by a different club',
        });
      }
      const selectedClub = await ctx.db.query.club.findFirst({
        where: eq(club.id, input.clubId),
      });
      if (!selectedClub) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'no club found',
        });
      }

      // this should only happen on resyncs
      if (selectedClub.calendarId && !selectedClub.calendarGoogleAccountId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'no connected google account',
        });
      }
      await ctx.db
        .update(club)
        .set({
          calendarId: input.calendarId,
          calendarGoogleAccountId: ctx.session.user.id,
          calendarName: input.calendarName,
          calendarSyncToken: null,
        })
        .where(eq(club.id, input.clubId));
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: await getGoogleAccessToken(
          selectedClub.calendarGoogleAccountId ?? ctx.session.user.id,
        ),
      });
      try {
        const sync = await syncCalendar(input.clubId, false, oauth2Client); // one-time sync
        try {
          await watchCalendar(input.clubId); // create the webhook to sync updates in the future
          return sync;
        } catch (error) {
          // if webhook wasn't established, it's okay because events have synced
          if (
            error &&
            typeof error === 'object' &&
            'message' in error &&
            error.message ===
              'Push notifications are not supported by this resource.'
          ) {
            return { status: 'ONE_TIME_SYNC', data: sync };
          }
          throw error; // if it's not a webhook subscription issue
        }
      } catch (error) {
        console.error(
          'Sync failed, reverting DB changes:',
          (error as { message: string }).message,
        );
        await ctx.db
          .update(club)
          .set({
            calendarId: null,
            calendarGoogleAccountId: null,
            calendarName: null,
            calendarSyncToken: null,
          })
          .where(eq(club.id, input.clubId));

        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          error.status === 404
        ) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Could not find calendar: ${(error as { message?: string }).message || 'Unknown error'}`,
          });
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Could not connect calendar: ${(error as { message?: string }).message || 'Unknown error'}`,
          });
        }
      }
    }),
  slug: authedProcedure
    .input(editSlugSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.id, {
        President: {
          errorMessage: "Only a club admin can update the club's slug",
        },
      });

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
  delete: authedProcedure
    .input(clubIdSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        President: {
          errorMessage: 'Only a club admin can delete the club',
        },
      });

      await Promise.all([
        callStorageAPI('DELETE', `${input.clubId}-profile`),
        callStorageAPI('DELETE', `${input.clubId}-banner`),
        ctx.db.delete(club).where(eq(club.id, input.clubId)),
      ]);
    }),
  markDeleted: authedProcedure
    .input(clubIdSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        President: {
          errorMessage: 'Only a club admin can mark the club as deleted',
        },
      });

      await ctx.db
        .update(club)
        .set({
          approved: 'deleted',
        })
        .where(and(eq(club.id, input.clubId), eq(club.approved, 'approved')));
    }),
  restore: authedProcedure
    .input(clubIdSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        President: {
          errorMessage: 'Only a club admin can restore the club',
        },
      });

      await ctx.db
        .update(club)
        .set({
          approved: 'approved',
        })
        .where(eq(club.id, input.clubId));
    }),
  removeMembers: authedProcedure
    .input(removeMembersSchema)
    .mutation(async ({ input, ctx }) => {
      await requireMemberRole(ctx.session.user.id, input.clubId, {
        President: {
          errorMessage: 'Must be a club admin to remove members',
        },
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

export default clubManageRouter;
