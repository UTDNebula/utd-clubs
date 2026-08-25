import { addDays } from 'date-fns';
import { and, eq, gt, inArray, not } from 'drizzle-orm';
import { google } from 'googleapis';
import { nanoid } from 'nanoid';
import { dbWithSessions } from '@/server/db';
import { calendarWebhooks } from '@/server/db/schema/calendarWebhooks';
import { club as clubTable } from '@/server/db/schema/club';
import { getAuthForClub } from './getAuth';

const db = dbWithSessions;

export async function watchCalendar(clubId: string, refresh: boolean = false) {
  // check if webhook exists
  const existingWebhook = await db.query.calendarWebhooks.findFirst({
    where: and(
      eq(calendarWebhooks.clubId, clubId),
      gt(calendarWebhooks.expiration, new Date()), // Check if expiration is in the future
    ),
  });

  if (existingWebhook && !refresh) {
    console.log(`GCal for clubId ${clubId} is already being watched.`);
    return {
      channelId: existingWebhook.id,
      expires: existingWebhook.expiration,
    };
  }
  if (!refresh)
    console.log(`GCal for clubId ${clubId} is not being watched yet`);
  else console.log(`refreshing clubId ${clubId}`);

  // get auth & club data
  const [auth, clubData] = await Promise.all([
    getAuthForClub(clubId),
    db.query.club.findFirst({
      where: eq(clubTable.id, clubId),
    }),
  ]);

  if (!clubData || !clubData.calendarId || !clubData.calendarGoogleAccountId)
    throw new Error(`clubId ${clubId} has no Calendar to sync`);

  // randomized id for new channel and token for verification
  const channelId = nanoid();
  const token = nanoid();

  // create webhook
  try {
    const response = await google.calendar('v3').events.watch({
      auth,
      calendarId: clubData.calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: `${process.env.GOOGLE_WEBHOOK_URL || process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/calendar`,
        token: token,
      },
    });

    // insert the new webhook connection for the club
    const expires = response.data.expiration
      ? new Date(parseInt(response.data.expiration))
      : addDays(new Date(), 7); // default to 7 days
    await db.insert(calendarWebhooks).values({
      id: channelId,
      resourceId: response.data.resourceId!, // it will work, because I don't know what I'll do if it doesn't
      clubId: clubId,
      token: token,
      expiration: expires,
    });

    console.log(`GCal for clubId ${clubId} is now being watched`);

    return { channelId, expires };
  } catch (error) {
    throw error;
  }
}

export async function stopWatching(clubId: string, channelIdToKeep?: string) {
  let webhooks = [];
  if (channelIdToKeep) {
    webhooks = await db.query.calendarWebhooks.findMany({
      where: and(
        eq(calendarWebhooks.clubId, clubId),
        not(eq(calendarWebhooks.id, channelIdToKeep)),
      ),
    });
  } else {
    webhooks = await db.query.calendarWebhooks.findMany({
      where: eq(calendarWebhooks.clubId, clubId),
    });
  }

  if (!webhooks || webhooks.length == 0) {
    console.error(`Could not find webhook to delete for clubID: ${clubId}`);
    return;
  }

  const auth = await getAuthForClub(clubId);

  await Promise.all(
    webhooks.map(async (webhook) => {
      try {
        await google.calendar('v3').channels.stop({
          auth,
          requestBody: {
            id: webhook.id,
            resourceId: webhook.resourceId,
          },
        });
        console.log('Stopped channel');
      } catch (e) {
        console.error('Could not stop channel', e);
      }
    }),
  );

  const webhookIds = webhooks.map((w) => w.id);
  // Delete webhook from data
  await db
    .delete(calendarWebhooks)
    .where(inArray(calendarWebhooks.id, webhookIds));
  console.log('deleted webhook from db');
}
