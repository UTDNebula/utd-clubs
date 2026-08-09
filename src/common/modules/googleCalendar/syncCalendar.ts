import { TZDateMini } from '@date-fns/tz';
import { DatabaseError } from '@neondatabase/serverless';
import { subMinutes } from 'date-fns';
import {
  and,
  DrizzleError,
  eq,
  getTableColumns,
  getTableName,
  inArray,
  isNull,
  or,
  SQL,
  sql,
  type InferInsertModel,
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { GaxiosError } from 'gaxios';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import z from 'zod';
import { dbWithSessions } from '@/server/db';
import { club as clubTable } from '@/server/db/schema/club';
import { events as eventTable } from '@/server/db/schema/events';
import { gCalEventSchema } from './gCalEventSchema';

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
              or(
                eq(eventTable.calendarId, club.calendarId),
                isNull(eventTable.calendarId),
              ),
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
          .map((e) => gCalEventSchema.safeParse(e))
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
                  'google',
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
  event: z.infer<typeof gCalEventSchema>,
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
      ? new TZDateMini(event.start.date + 'T00:00:00', 'America/Chicago')
      : event.start.dateTime
        ? new Date(event.start.dateTime)
        : new Date(),
    endTime: event.end.date
      ? subMinutes(
          new TZDateMini(event.end.date + 'T00:00:00', 'America/Chicago'),
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
