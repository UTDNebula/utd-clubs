import { and, eq, or, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod';
import { type personalCats } from '@src/constants/categories';
import { auth } from '@src/server/auth';
import {
  insertUserMetadata,
  SelectUserMetadataToClubs,
  SelectUserMetadataWithClubs,
} from '@src/server/db/models';
import { admin } from '@src/server/db/schema/admin';
import { user as users } from '@src/server/db/schema/auth';
import { userMetadata, userMetadataToClubs } from '@src/server/db/schema/users';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const byIdSchema = z.object({ id: z.string() });

const updateByIdSchema = z.object({
  updateUser: insertUserMetadata.partial().omit({ id: true }),
  clubs: z.string().array().optional(),
});
const nameOrEmailSchema = z.object({
  search: z.string().default(''),
});

const eventsSortSchema = z.object({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
});

export const userMetadataRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(byIdSchema)
    .query(
      async ({
        input,
        ctx,
      }): Promise<SelectUserMetadataWithClubs | undefined> => {
        const { id } = input;
        const userMetadata = await ctx.db.query.userMetadata.findFirst({
          where: (userMetadata) => eq(userMetadata.id, id),
          with: { clubs: true },
        });

        return userMetadata;
      },
    ),
  updateById: protectedProcedure
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
  deleteById: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.session;
    await ctx.db.delete(users).where(eq(users.id, user.id));
    await ctx.db.delete(userMetadata).where(eq(userMetadata.id, user.id));
  }),
  getEvents: protectedProcedure
    .input(eventsSortSchema)
    .query(async ({ input, ctx }) => {
      const { currentTime, sortByDate } = input;

      const rows = await ctx.db.query.userMetadataToEvents.findMany({
        where: (userMetadataToEvents) =>
          eq(userMetadataToEvents.userId, ctx.session.user.id),
        with: {
          event: {
            with: {
              club: true,
            },
          },
        },
      });

      let events = rows.map((item) => item.event);

      if (currentTime) {
        events = events.filter((ev) => ev.endTime >= currentTime);
      }

      if (sortByDate) {
        events = events.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        );
      }

      return events;
    }),
  getEventsFromJoinedClubs: protectedProcedure
    .input(eventsSortSchema)
    .query(async ({ input, ctx }) => {
      const { currentTime, sortByDate } = input;

      const rows = await ctx.db.query.userMetadataToClubs.findMany({
        where: (t) => eq(t.userId, ctx.session.user.id),
        with: {
          club: {
            with: {
              events: {
                with: { club: true },
              },
            },
          },
        },
      });

      let events = rows.flatMap((row) => row.club.events);

      if (currentTime) {
        events = events.filter((ev) => ev.endTime >= currentTime);
      }

      if (sortByDate) {
        events = events.sort(
          (a, b) => a.startTime.getTime() - b.startTime.getTime(),
        );
      }

      return events;
    }),
  searchByNameOrEmail: publicProcedure
    .input(nameOrEmailSchema)
    .query(async ({ input, ctx }) => {
      const q = `%${input.search}%`;

      const result = await ctx.db
        .select({
          id: users.id,
          email: users.email,
          firstName: userMetadata.firstName,
          lastName: userMetadata.lastName,
        })
        .from(users)
        .leftJoin(userMetadata, eq(userMetadata.id, users.id))
        .where(
          sql`
            CONCAT(${userMetadata.firstName}, ' ', ${userMetadata.lastName}) ILIKE ${q}
            OR ${users.email} ILIKE ${q}
          `,
        );

      return result;
    }),
  getUserSidebarCapabilities: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    const capabilites: (typeof personalCats)[number][] = [];
    if (!session) return capabilites;
    if (
      await ctx.db.query.userMetadataToClubs.findFirst({
        where: and(
          eq(userMetadataToClubs.userId, session.user.id),
          or(
            eq(userMetadataToClubs.memberType, 'Officer'),
            eq(userMetadataToClubs.memberType, 'President'),
          ),
        ),
      })
    ) {
      capabilites.push('Manage Clubs');
    } else {
      capabilites.push('Create Club');
    }
    if (
      (
        await ctx.db.query.admin.findMany({
          where: eq(admin.userId, session.user.id),
        })
      ).length === 1
    )
      capabilites.push('Admin');
    return capabilites;
  }),
});
