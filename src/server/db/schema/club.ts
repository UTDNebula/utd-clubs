import { relations, type SQL, sql } from 'drizzle-orm';
import {
  boolean,
  customType,
  index,
  integer,
  pgEnum,
  pgMaterializedView,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { events } from './events';
import { userMetadataToClubs } from './users';
import { contacts } from './contacts';
import { carousel } from './admin';
import { officers } from './officers';

export const tsvector = customType<{ data: string }>({
  dataType() {
    return `tsvector`;
  },
});

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
    description: text('description').notNull(),
    tags: text('tags')
      .array()
      .default(sql`'{}'::text[]`)
      .notNull(),
    // * Approved will be null by default and will be set to true when the club is approved or false when the club is rejected
    // * This allows us to have a pending state for clubs and keep info about them in the database
    approved: approvedEnum('approved').notNull().default('pending'),
    profileImage: text('profile_image'),
    soc: boolean('soc').notNull().default(false),
    clubSearchVector: tsvector().generatedAlwaysAs(
      (): SQL => sql` setweight(to_tsvector('english', ${club.name}), 'A') || ' ' ||
                      setweight(array_to_tsvector( ${club.tags}), 'B') ||' ' ||
                      setweight(to_tsvector('english', ${club.description}), 'C')`,
    ),
  },
  (t) => [
    index('idx_club_search').using('gin', t.clubSearchVector),
    uniqueIndex('club_slug_unique').on(t.slug),
  ],
);

export const clubRelations = relations(club, ({ many }) => ({
  contacts: many(contacts),
  events: many(events),
  officers: many(officers),
  userMetadataToClubs: many(userMetadataToClubs),
  carousel: many(carousel),
}));

export const usedTags = pgMaterializedView('used_tags', {
  tag: text('tag').notNull(),
  count: integer('count').notNull(),
  tagSearch: tsvector('tag_search').notNull(),
}).as(
  sql`select UNNEST(${club.tags}) as tag, COUNT(${club.tags}) as count, to_tsvector('english', UNNEST(${club.tags})) as tag_search from club group by UNNEST(${club.tags}) order by count desc`,
);
