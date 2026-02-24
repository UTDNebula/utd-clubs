import { differenceInMinutes } from 'date-fns';
import { eq } from 'drizzle-orm';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { user } from '@src/server/db/schema/auth';

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
    const accessToken = (
      await auth.api.refreshToken({
        body: { providerId: 'google', userId: userId },
      })
    ).accessToken;
    if (!accessToken) {
      await db.update(user).set().where(eq(user.id, userId));
      throw new Error('Access Token failed to generate');
    }
    return accessToken;
  } else {
    return googleAccount.accessToken;
  }
}
