import { TZDate, TZDateMini } from '@date-fns/tz';
import { DatabaseError } from '@neondatabase/serverless';
import { addDays, subMinutes } from 'date-fns';
import {
  and,
  DrizzleError,
  eq,
  getTableColumns,
  getTableName,
  inArray,
  SQL,
  sql,
} from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import z from 'zod';
import { dbWithSessions } from '@src/server/db';
import { club as clubTable } from '@src/server/db/schema/club';
import { events as eventTable } from '@src/server/db/schema/events';
import { userMetadataToEvents } from '@src/server/db/schema/users';

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
  const eventsReq = await google.calendar('v3').events.list({
    calendarId: club.calendarId,
    syncToken: syncToken,
    singleEvents: true,
    auth: auth,
  });

  // if sync token is invalid perform a full sync
  if (eventsReq.status == 410) {
    await db
      .update(clubTable)
      .set({ calendarSyncToken: null })
      .where(eq(clubTable.id, clubId));
    syncToken = undefined;
    events = (
      await google.calendar('v3').events.list({
        calendarId: club.calendarId,
        syncToken: syncToken,
        singleEvents: true,
        auth: auth,
      })
    ).data;
    reset = true;
  } else {
    events = eventsReq.data;
  }

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
          console.log(JSON.stringify(error));
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
            console.log('DB error:', actualError.message);
            // You could throw a more specific, user-friendly error from here
            throw new Error(actualError.message);
          } else {
            console.log(
              'An unexpected database error occurred:',
              error.message,
            );
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
