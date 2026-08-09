import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { dbWithSessions } from '@/server/db';
import { club as clubTable } from '@/server/db/schema/club';
import { getGoogleAccessToken } from '@/lib/modules/googleOAuth';

const db = dbWithSessions;

export async function getAuthForClub(clubId: string): Promise<OAuth2Client> {
  const clubData = await db.query.club.findFirst({
    where: eq(clubTable.id, clubId),
    columns: { calendarGoogleAccountId: true },
  });

  if (!clubData?.calendarGoogleAccountId) {
    throw new Error('Club has no linked Google Calendar');
  }

  const accessToken = await getGoogleAccessToken(
    clubData.calendarGoogleAccountId,
  );

  // create new auth client for creating and deleting a calendar watch
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.GOOGLE_WEBHOOK_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`, // BetterAuth handles this
  );

  auth.setCredentials({ access_token: accessToken });
  return auth;
}
