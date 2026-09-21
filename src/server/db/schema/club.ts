import { relations, sql, type SQL } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgMaterializedView,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { contacts } from './contacts';
import { tsvector } from './customTypes';
import { events } from './events';
import { membershipForms } from './membershipForms';
import { officers } from './officers';
import { userMetadataToClubs } from './users';

export const approvedEnum = pgEnum('approved_enum', [
  'approved',
  'rejected',
  'pending',
  'deleted',
]);

export const schoolEnum = pgEnum('school_enum', [
  'Harry W. Bass Jr. School of Arts, Humanities, and Technology',
  'School of Behavioral and Brain Sciences',
  'School of Economic, Political and Policy Sciences',
  'Erik Jonsson School of Engineering and Computer Science',
  'School of Interdisciplinary Studies',
  'Naveen Jindal School of Management',
  'School of Natural Sciences and Mathematics',
]);

export const clubSizeEnum = pgEnum('club_size', [
  '1-10',
  '10-50',
  '50-200',
  '200+',
]);

export const club = pgTable(
  'club',
  {
    id: text('id')
      .default(sql`nanoid(20)`)
      .primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    alias: text('alias'),
    foundingDate: timestamp('founding_date'),
    updatedAt: timestamp('updated_at'),
    description: text('description').notNull(),
    tags: text('tags')
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    // * Approved will be null by default and will be set to true when the club is approved or false when the club is rejected
    // * This allows us to have a pending state for clubs and keep info about them in the database
    approved: approvedEnum('approved').notNull().default('pending'),
    profileImage: text('profile_image'),
    bannerImage: text('banner_image'),
    soc: boolean('soc').notNull().default(false),
    pageViews: integer('page_views').notNull().default(0),
    calendarId: text('calendar_id'),
    calendarName: text('calendar_name'),
    calendarSyncToken: text('calendar_sync_token'),
    calendarWebhookId: text('calendar_webhook_id'),
    calendarWebHookExpiration: timestamp('calendar_webhook_expiration'),
    clubSize: clubSizeEnum('club_size'),
    calendarGoogleAccountId: text('calendarGoogleAccountId').references(
      () => user.id,
      { onDelete: 'set null' },
    ),
    // Changed from single school enum to an array of school enums
    schools: schoolEnum()
      .array()
      .default(sql`'{}'::school_enum[]`)
      .notNull(),
    searchTsv: tsvector('search_tsv').generatedAlwaysAs(
      (): SQL =>
        sql`setweight(to_tsvector('english', coalesce(alias, '')), 'A') || setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(immutable_array_to_string(tags, ' '), '')), 'B') || setweight(to_tsvector('english', coalesce(description, '')), 'C')`,
    ),
  },
  (t) => [
    index('club_search_idx').using('lakebase_bm25', t.searchTsv),
    index('club_name').on(t.name),
    uniqueIndex('club_slug_unique').on(t.slug),
  ],
);

export const clubRelations = relations(club, ({ many }) => ({
  contacts: many(contacts),
  events: many(events),
  officers: many(officers),
  membershipForms: many(membershipForms),
  userMetadataToClubs: many(userMetadataToClubs),
}));

export const usedTags = pgMaterializedView('used_tags', {
  tag: text('tag').notNull(),
  count: integer('count').notNull(),
  id: integer('id').notNull(),
}).as(sql`
  SELECT 
    tag, 
    COUNT(*) as count, 
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)::integer as id 
  FROM (
    SELECT UNNEST(${club.tags}) as tag FROM ${club} WHERE club.approved = 'approved'
  ) sub 
  GROUP BY tag 
  ORDER BY count DESC
`);
