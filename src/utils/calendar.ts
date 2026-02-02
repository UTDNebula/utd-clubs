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
  not,
  SQL,
  sql,
  type InferInsertModel,
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { GaxiosError } from 'gaxios';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { nanoid } from 'nanoid';
import z from 'zod';
import { dbWithSessions } from '@src/server/db';
import { calendarWebhooks } from '@src/server/db/schema/calendarWebhooks';
import { club as clubTable } from '@src/server/db/schema/club';
import { events as eventTable } from '@src/server/db/schema/events';
import { getGoogleAccessToken } from './googleAuth';

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
  } catch (error) {
    // if sync token is invalid perform a full sync
    if (error instanceof GaxiosError) {
      if (error.status === 410) {
        console.log(
          `syncToken for ${club.calendarId} invalid, will perform a full sync`,
        );
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
      } else if (error.status === 404) {
        console.error(`Google could not find calendar ${club.calendarId}`);
        throw error;
      }
    }
    throw error;
  }

  const res = await db.transaction(
    async (tx) => {
      await tx.execute(sql`SET CONSTRAINTS ALL DEFERRED`);
      if (reset && club.calendarId) {
        // club must have a calendar currently synced before resetting events of the calendar
        // SCARY
        await tx
          .update(eventTable)
          .set({ status: 'deleted' })
          .where(
            and(
              eq(eventTable.clubId, clubId),
              eq(eventTable.google, true),
              eq(eventTable.calendarId, club.calendarId),
            ),
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

          // await tx
          //   .delete(userMetadataToEvents)
          //   .where(inArray(userMetadataToEvents.eventId, deletedIds));
          await tx
            .update(eventTable)
            .set({ status: 'deleted' })
            .where(inArray(eventTable.id, deletedIds));
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
                  'clubId',
                  'status',
                  'image',
                  'startTime',
                  'endTime',
                  'recurrence',
                  'recurenceId',
                  'etag',
                  'location',
                  'createdAt',
                  'updatedAt',
                  'calendarId',
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
  console.log(`Synced events for clubId: ${clubId}`);
  return res;
}
function generateEvent(
  clubId: string,
  event: z.infer<typeof eventSchema>,
): InferInsertModel<typeof eventTable> {
  let imageUrl: string | null = null;

  if (event.attachments) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const image = event.attachments.filter((e) =>
      allowedTypes.includes(e.mimeType),
    )[0]; // get the first image

    if (image?.fileId) {
      imageUrl = `https://lh3.googleusercontent.com/d/${image.fileId}`;
    }
  }
  return {
    id: event.id,
    clubId: clubId,
    name: event.summary,
    status: 'approved',
    description: event.description,
    image: imageUrl,
    recurrence: JSON.stringify(event.recurrence),
    recurenceId: event.recurringEventId,
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
    calendarId: event.organizer?.email,
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
  description: z.string().optional(),
  recurrence: z.string().array().optional(),
  recurringEventId: z.string().optional(),
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
  organizer: z
    .object({
      email: z.string(),
      displayName: z.string().optional(),
      self: z.boolean().optional(),
    })
    .optional(),
  attachments: z
    .array(
      z.object({
        fileUrl: z.string(),
        title: z.string(),
        mimeType: z.string(),
        fileId: z.string(),
      }),
    )
    .optional(),
});
