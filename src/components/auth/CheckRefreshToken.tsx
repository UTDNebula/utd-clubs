import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { account } from '@src/server/db/schema/auth';
import { GoogleReauthHandler } from './GoogleReauthHandler';

export const CheckRefreshToken = async () => {
  // check if refresh_token is present
  let needsGoogleReauth = false;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const acct = await db.query.account.findFirst({
      where: and(
        eq(account.userId, session.user.id),
        eq(account.providerId, 'google'),
      ),
    });

    // If account exists, is google, and has NO refresh token -> Flag it
    if (acct && !acct.refreshToken) {
      needsGoogleReauth = true;
    }
  }

  return <>{needsGoogleReauth && <GoogleReauthHandler />}</>;
};
