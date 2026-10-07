import { differenceInMinutes } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { account } from '@/server/db/schema/auth';

export default async function getGoogleAccessToken(
  userId: string,
  useRefreshToken: boolean = false,
) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const googleUserAccount = accounts.find(
    (account) => account.providerId === 'google',
  );

  if (!googleUserAccount) {
    throw new Error('Google account is not linked');
  }

  const googleAccount = await auth.api.getAccessToken({
    body: { accountId: googleUserAccount.id, userId: userId },
  });

  if (
    useRefreshToken ||
    differenceInMinutes(googleAccount.accessTokenExpiresAt!, Date.now()) <= 10
  ) {
    try {
      const accessToken = (
        await auth.api.refreshToken({
          body: { accountId: googleUserAccount.id, userId: userId },
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
