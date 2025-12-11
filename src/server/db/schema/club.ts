import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  index,
  integer,
  pgEnum,
  pgMaterializedView,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { contacts } from './contacts';
import { events } from './events';
import { officers } from './officers';
import { userMetadataToClubs } from './users';

export const approvedEnum = pgEnum('approved_enum', [
  'approved',
  'rejected',
  'pending',
]);

export const club = pgTable(
  'club',
  {
    id: text('id')
      .default(sql`nanoid(20)`)
      .primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
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
  },
  (t) => [
    index('club_search_idx')
      .using('bm25', t.id, t.name, t.description, t.tags, t.approved)
      .with({
        key_field: 'id',
        text_fields: `'${JSON.stringify({
          tags: { tokenizer: { type: 'keyword' } },
          name: { tokenizer: { type: 'default', stemmer: 'English' } },
        })}'`,
        numeric_fields: `'{"approved":{"fast":true}}'`,
      }),
    index('club_name').on(t.name),
    uniqueIndex('club_slug_unique').on(t.slug),
  ],
);

export const clubRelations = relations(club, ({ many }) => ({
  contacts: many(contacts),
  events: many(events),
  officers: many(officers),
  userMetadataToClubs: many(userMetadataToClubs),
}));

// TODO add schema for search index
export const usedTags = pgMaterializedView('used_tags', {
  tag: text('tag').notNull(),
  count: integer('count').notNull(),
  id: integer('id').notNull(),
}).as(
  sql`select UNNEST(${club.tags}) as tag, COUNT(${club.tags}) as count, from club order by count desc`,
);
