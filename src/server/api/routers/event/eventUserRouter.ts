import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { userMetadataToEvents } from '@/server/db/schema/users';
import { getGoogleAccessToken } from '@/common/modules/auth/googleAuth';
import { createTRPCRouter, authedProcedure, publicProcedure } from '@/server/api/trpc';
import { joinLeaveSchema } from './schemas';

const eventUserRouter = createTRPCRouter({
  joinedEvent: publicProcedure
    .input(joinLeaveSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;
      const eventId = input.id;
      const userId = ctx.session.user.id;
      return Boolean(
        await ctx.db.query.userMetadataToEvents.findFirst({
          where: (userMetadataToEvents) =>
            and(
              eq(userMetadataToEvents.userId, userId),
              eq(userMetadataToEvents.eventId, eventId),
            ),
        }),
      );
    }),
  registerState: publicProcedure
    .input(joinLeaveSchema)
    .query(async ({ input, ctx }) => {
      if (!ctx.session) return null;

      const eventId = input.id;
      const userId = ctx.session.user.id;
      const result = await ctx.db.query.userMetadataToEvents.findFirst({
        where: (userMetadataToEvents) =>
          and(
            eq(userMetadataToEvents.userId, userId),
            eq(userMetadataToEvents.eventId, eventId),
          ),
      });
      return {
        registered: Boolean(result),
        registeredAt: result?.registeredAt ?? null,
      };
    }),
  toggleRegistration: authedProcedure
    .input(joinLeaveSchema)
    .mutation(async ({ ctx, input }) => {
      const eventId = input.id;
      const userId = ctx.session.user.id;
      const dataExists = await ctx.db.query.userMetadataToEvents.findFirst({
        where: (userMetadataToEvents) =>
          and(
            eq(userMetadataToEvents.userId, userId),
            eq(userMetadataToEvents.eventId, eventId),
          ),
      });
      if (dataExists) {
        await ctx.db
          .delete(userMetadataToEvents)
          .where(
            and(
              eq(userMetadataToEvents.userId, userId),
              eq(userMetadataToEvents.eventId, eventId),
            ),
          );
      } else {
        await ctx.db
          .insert(userMetadataToEvents)
          .values({ userId, eventId, registeredAt: new Date() });
      }
      return dataExists;
    }),
  getUserCalendars: authedProcedure.query(async ({ ctx }) => {
    const accessToken = await getGoogleAccessToken(ctx.session.user.id, true);
    const googleOauthClient = new OAuth2Client();
    googleOauthClient.setCredentials({ access_token: accessToken });
    try {
      const res = await googleOauthClient.fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      );
      if (res.ok) {
        return (
          res.data as {
            items: { id: string; summary: string; description: string }[];
          }
        ).items;
      } else {
        throw new TRPCError({
          message: JSON.stringify(res.data),
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }),
});

export default eventUserRouter;
