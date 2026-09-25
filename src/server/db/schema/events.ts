import { relations, sql, type SQL } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { club } from './club';
import { tsvector } from './customTypes';
import { userMetadataToEvents } from './users';

export const statusEnum = pgEnum('status_enum', [
  'approved',
  'rejected',
  'pending',
  'deleted',
]);

export const eventCollabInviteStatusEnum = pgEnum(
  'event_collab_invite_status',
  ['accepted', 'pending', 'rejected'],
);

export const events = pgTable(
  'events',
  {
    id: text('id')
      .default(sql`nanoid(20)`)
      .primaryKey(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description').default('').notNull(),
    status: statusEnum('approved').notNull().default('approved'),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    recurrence: text('recurrence'),
    recurenceId: text('recurence_id'),
    google: boolean().default(false).notNull(),
    etag: text(),
    location: text('location').default('').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    pageViews: integer('page_views').notNull().default(0),
    calendarId: text('calendar_id'),
    searchTsv: tsvector('search_tsv').generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(location, '')), 'B') || setweight(to_tsvector('english', coalesce(description, '')), 'C')`,
    ),
  },
  (t) => [index('event_search_idx').using('lakebase_bm25', t.searchTsv)],
);

export const eventCollaborations = pgTable(
  'event_collaborations',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    inviterClubId: text('inviter_club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    inviteeClubId: text('invitee_club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    status: eventCollabInviteStatusEnum('status').notNull(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.inviteeClubId] })],
);

export const eventsRelation = relations(events, ({ one, many }) => ({
  club: one(club, { fields: [events.clubId], references: [club.id] }),
  userMetadataToEvents: many(userMetadataToEvents),
  eventCollaborations: many(eventCollaborations),
}));
