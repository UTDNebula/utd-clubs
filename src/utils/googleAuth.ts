import { differenceInMinutes } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { account } from '@src/server/db/schema/auth';

export async function getGoogleAccessToken(
  userId: string,
  useRefreshToken: boolean = false,
) {
  const googleAccount = await auth.api.getAccessToken({
    body: { providerId: 'google', userId: userId },
  });
  if (
    useRefreshToken ||
    differenceInMinutes(googleAccount.accessTokenExpiresAt!, Date.now()) <= 10
  ) {
    try {
      const accessToken = (
        await auth.api.refreshToken({
          body: { providerId: 'google', userId: userId },
        })
      ).accessToken;
      if (!accessToken) throw new Error('Access Token failed to generate');
      return accessToken;
    } catch (error) {
      await db
        .update(account)
        .set({ refreshToken: null, refreshTokenExpiresAt: null })
        .where(
          and(eq(account.userId, userId), eq(account.providerId, 'google')),
        );
      throw error;
    }
  } else {
    return googleAccount.accessToken;
  }
}
