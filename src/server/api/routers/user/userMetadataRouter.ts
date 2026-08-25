import { and, eq, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { type personalCats } from '@/lib/modules/navigation/categories';
import {
  authedProcedure,
  createTRPCRouter,
  publicProcedure,
} from '@/server/api/trpc';
import { auth } from '@/server/auth';
import {
  SelectUserMetadataToClubs,
  SelectUserMetadataWithClubs,
} from '@/server/db/models';
import { admin } from '@/server/db/schema/admin';
import { user as users } from '@/server/db/schema/auth';
import {
  userAiCache,
  userMetadata,
  userMetadataToClubs,
} from '@/server/db/schema/users';
import { userIdSchema } from '../baseSchemas';
import { updateByIdSchema } from './inputSchemas';

const userMetadataRouter = createTRPCRouter({
  byId: authedProcedure
    .input(userIdSchema)
    .query(
      async ({
        input,
        ctx,
      }): Promise<SelectUserMetadataWithClubs | undefined> => {
        const { userId } = input;
        const userMetadata = await ctx.db.query.userMetadata.findFirst({
          where: (userMetadata) => eq(userMetadata.id, userId),
          with: { clubs: true },
        });

        return userMetadata;
      },
    ),
  updateById: authedProcedure
    .input(updateByIdSchema)
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<SelectUserMetadataWithClubs | undefined> => {
        const { updateUser, clubs } = input;
        const { user } = ctx.session;

        const updatedUser = (
          await ctx.db
            .update(userMetadata)
            .set(updateUser)
            .where(eq(userMetadata.id, user.id))
            .returning()
        )[0];

        let updatedClubs: SelectUserMetadataToClubs[] = [];

        if (clubs !== undefined) {
          if (clubs.length === 0) {
            await ctx.db
              .delete(userMetadataToClubs)
              .where(and(eq(userMetadataToClubs.userId, user.id)));
          } else {
            updatedClubs = await ctx.db
              .delete(userMetadataToClubs)
              .where(
                and(
                  eq(userMetadataToClubs.userId, user.id),
                  // Invert the condition to delete all clubs that are not in the array
                  sql`${userMetadataToClubs.clubId} NOT IN (${clubs})`,
                ),
              )
              .returning();
          }
        }

        // Update `name` field in BetterAuth user information to match user metadata
        const name = `${updateUser.firstName} ${updateUser.lastName}`;
        if (user.name != name) {
          try {
            await auth.api.updateUser({
              body: { name },
              headers: await headers(),
            });
          } catch (e) {
            console.error(
              `Unable to update name field for${updateUser.firstName ? ` ${name}'s` : ''} user information`,
              e,
            );
          }
        }

        return { ...updatedUser!, clubs: updatedClubs };
      },
    ),
  deleteById: authedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    await ctx.db.delete(users).where(eq(users.id, user.id));
    await ctx.db.delete(userMetadata).where(eq(userMetadata.id, user.id));
  }),
  getUserSidebarCapabilities: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    const capabilites: (typeof personalCats)[number][] = [];
    if (!session) return capabilites;

    const [isOfficer, isAdmin] = await Promise.all([
      ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, session.user.id),
          or(
            eq(userMetadataToClubs.memberType, 'Officer'),
            eq(userMetadataToClubs.memberType, 'President'),
          ),
        ),
      }),
      ctx.db.query.admin.findFirst({
        where: eq(admin.userId, session.user.id),
      }),
    ]);
    if (isOfficer) {
      capabilites.push('Manage Clubs');
    } else {
      capabilites.push('Create Club');
    }
    if (isAdmin) capabilites.push('Admin');
    return capabilites;
  }),
  didClubMatch: publicProcedure.query(async ({ ctx }): Promise<boolean> => {
    const userId = ctx.session?.user.id;
    if (!userId) return false;
    const aiCache = await ctx.db.query.userAiCache.findFirst({
      where: eq(userAiCache.id, userId),
    });
    return Boolean(aiCache);
  }),
});

export default userMetadataRouter;
