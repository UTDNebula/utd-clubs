import { TZDateMini } from '@date-fns/tz';
import { DatabaseError } from '@neondatabase/serverless';
import { addDays, subMinutes } from 'date-fns';
import {
  and,
  DrizzleError,
  eq,
  getTableColumns,
  getTableName,
  gt,
  inArray,
  SQL,
  sql,
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { nanoid } from 'nanoid';
import z from 'zod';
import { dbWithSessions } from '@src/server/db';
import { calendarWebhooks } from '@src/server/db/schema/calendarWebhooks';
import { club as clubTable } from '@src/server/db/schema/club';
import { events as eventTable } from '@src/server/db/schema/events';
import { userMetadataToEvents } from '@src/server/db/schema/users';
import { getGoogleAccessToken } from './googleAuth';
import { GaxiosError } from 'gaxios';

const db = dbWithSessions;

export async function syncCalendar(
  clubId: string,
  fullSync = false,
  auth: OAuth2Client,
) {
  const club = await db.query.club.findFirst({
    where: (club, { eq }) => eq(club.id, clubId),
    columns: {
      id: true,
      calendarSyncToken: true,
      calendarId: true,
    },
  });
  if (!club) throw new Error('Club not Found.');
  if (!club.calendarId) throw new Error('No Calendar to sync.');
  let reset = !club.calendarSyncToken || fullSync;
  let syncToken = reset ? undefined : (club.calendarSyncToken ?? undefined);
  let events;

  try {
    const eventsReq = await google.calendar('v3').events.list({
      calendarId: club.calendarId,
      syncToken: syncToken,
      singleEvents: true,
      auth: auth,
    });
    events = eventsReq.data;
  } catch(error) {
    // if sync token is invalid perform a full sync
    if (error instanceof GaxiosError) {
      if (error.status === 410) {
        console.log(`syncToken for ${club.calendarId} invalid, will perform a full sync`);
        await db
          .update(clubTable)
          .set({ calendarSyncToken: null })
          .where(eq(clubTable.id, clubId));
        syncToken = undefined;
        reset = true;

        // retry without sync token
        try {
          events = (
            await google.calendar('v3').events.list({
              calendarId: club.calendarId,
              syncToken: syncToken,
              singleEvents: true,
              auth: auth,
            })
          ).data;
        } catch (retryError) {
          throw retryError;
        }
      } else if (error.code === 404) {
        console.error("Google could not find calendar");
        throw new Error(`Calendar ${club.calendarId} not found.`);
      }
    }
    throw error;
  }
  
  console.log("events found: ", events);
  
  const res = await db.transaction(
    async (tx) => {
      await tx.execute(sql`SET CONSTRAINTS ALL DEFERRED`);
      if (reset) {
        // SCARY
        await tx
          .delete(eventTable)
          .where(
            and(eq(eventTable.clubId, clubId), eq(eventTable.google, true)),
          );
      }
      let pagesRemaining = true;
      let loopEvents = events;
      do {
        // split deleted events
        const newOrUpdated = (
          loopEvents.items?.filter((ev) => ev.status !== 'cancelled') ?? []
        )
          .map((e) => eventSchema.safeParse(e))
          .filter((e) => e.success == true)
          .map((e) => e.data);
        if (!reset) {
          const deletedIds = (
            loopEvents.items?.filter((ev) => ev.status === 'cancelled') ?? []
          )
            .map((e) => e.id)
            .filter((e) => e != undefined);

          await tx
            .delete(userMetadataToEvents)
            .where(inArray(userMetadataToEvents.eventId, deletedIds));
          await tx.delete(clubTable).where(inArray(clubTable.id, deletedIds));
        }
        try {
          if (newOrUpdated.length > 0) {
            await tx
              .insert(eventTable)
              .values(newOrUpdated.map((e) => generateEvent(clubId, e)))
              .onConflictDoUpdate({
                target: eventTable.id,
                set: buildConflictUpdateColumns(eventTable, [
                  'name',
                  'description',
                  'startTime',
                  'endTime',
                  'recurrence',
                  'recurenceId',
                  'etag',
                  'location',
                  'createdAt',
                  'updatedAt',
                ]),
              });
          }
        } catch (error) {
          if (
            !(error instanceof DrizzleError) ||
            !(error.cause instanceof DatabaseError)
          ) {
            throw error;
          }
          const actualError = error.cause;

          // Check the driver-specific error code
          if (actualError) {
            // PostgreSQL unique violation code
            // You could throw a more specific, user-friendly error from here
            throw new Error(actualError.message);
          } else {
            // Re-throw or handle other unexpected errors
            throw error;
          }
        }
        if (loopEvents.nextPageToken == undefined) {
          pagesRemaining = false;
          await tx
            .update(clubTable)
            .set({ calendarSyncToken: loopEvents.nextSyncToken ?? undefined })
            .where(eq(clubTable.id, clubId));
        } else {
          // need to fetch new pages
          loopEvents = (
            await google.calendar('v3').events.list({
              calendarId: club.calendarId!,
              syncToken: syncToken,
              pageToken: loopEvents.nextPageToken,
              singleEvents: true,
              auth: auth,
            })
          ).data;
        }
      } while (pagesRemaining);
      return 'successful sync';
    },
    { deferrable: true },
  );
  return res;
}
function generateEvent(clubId: string, event: z.infer<typeof eventSchema>) {
  return {
    id: event.id,
    clubId: clubId,
    name: event.summary,
    description: event.description,
    recurrence: JSON.stringify(event.recurrence),
    recurenceId: event.recurenceEventId,
    startTime: event.start.date
      ? new TZDateMini(event.start.date, 'America/Chicago')
      : event.start.dateTime
        ? new Date(event.start.dateTime)
        : new Date(),
    endTime: event.end.date
      ? subMinutes(
          addDays(new TZDateMini(event.end.date, 'America/Chicago'), 1),
          1,
        )
      : event.end.dateTime
        ? new Date(event.end.dateTime)
        : new Date(),
    google: true,
    etag: event.etag,
    location: event.location,
    createdAt: new Date(event.created),
    updatedAt: new Date(event.updated),
  };
}

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
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`, // BetterAuth handles this
    // TODO: need to set perms in GCP i think
  );

  auth.setCredentials({ access_token: accessToken });
  return auth;
}

export async function watchCalendar(clubId: string) {
  // check if webhook exists
  //TODO: what if it's a diff calendar for the same account
  const existingWebhook = await db.query.calendarWebhooks.findFirst({
    where: and(
      eq(calendarWebhooks.clubId, clubId),
      gt(calendarWebhooks.expiration, new Date()), // Check if expiration is in the future
    ),
  });

  if (existingWebhook) {
    console.log(`GCal for clubId ${clubId} is already being watched.`);
    return {
      channelId: existingWebhook.id,
      expiration: existingWebhook.expiration,
    };
  }
  console.log(`GCal for clubId ${clubId} is not being watched yet`);

  // get auth & club data
  const auth = await getAuthForClub(clubId);
  const clubData = await db.query.club.findFirst({
    where: eq(clubTable.id, clubId),
  });

  if (!clubData || !clubData.calendarId || !clubData.calendarGoogleAccountId)
    throw new Error(`clubId ${clubId} has no Calendar to sync`);

  // randomized id for new channel and token for verification
  const channelId = nanoid();
  const token = nanoid();

  // create webhook
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
}

export async function stopWatching(clubId: string) {
  const webhook = await db.query.calendarWebhooks.findFirst({
    where: eq(calendarWebhooks.clubId, clubId),
  });

  if (!webhook) {
    console.error(`Could not find webhook for clubID: ${clubId}`);
    return;
  }

  try {
    const auth = await getAuthForClub(clubId);
    await google.calendar('v3').channels.stop({
      auth,
      requestBody: {
        id: webhook.id,
        resourceId: webhook.resourceId,
      },
    });
    console.log("Stopped channel");
  } catch (e) {
    console.error('Could not stop channel', e);
  }

  // Delete webhook from data
  await db.delete(calendarWebhooks).where(eq(calendarWebhooks.id, webhook.id));
  console.log("deleted webhook from db");
}

const buildConflictUpdateColumns = <
  T extends PgTable,
  Q extends keyof T['_']['columns'],
>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  const tableName = getTableName(table);
  return columns.reduce(
    (acc, column) => {
      if (cls[column]) {
        const colName = cls[column].name;
        acc[column] =
          sql`COALESCE(${sql.raw(`excluded.${colName}`)},${sql.raw(`"${tableName}"."${colName}"`)})`;
      }
      return acc;
    },
    {} as Record<Q, SQL>,
  );
};

const eventSchema = z.object({
  id: z.string(),
  summary: z.string(),
  description: z.string(),
  recurrence: z.string().array().optional(),
  recurenceEventId: z.string().optional(),
  etag: z.string(),
  location: z.string().optional(),
  start: z.object({
    date: z.iso.date().optional(),
    dateTime: z.iso.datetime({ offset: true }).optional(),
    timeZone: z.string().optional(),
  }),
  end: z.object({
    date: z.iso.date().optional(),
    dateTime: z.iso.datetime({ offset: true }).optional(),
    timeZone: z.string().optional(),
  }),
  created: z.iso.datetime(),
  updated: z.iso.datetime(),
});
