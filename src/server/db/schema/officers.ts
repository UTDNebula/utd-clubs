import { relations } from 'drizzle-orm';
import { pgTable, text, boolean, uuid } from 'drizzle-orm/pg-core';
import { club } from './club';

export const officers = pgTable('officers', {
  id: uuid('id').defaultRandom().primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  name: text('name').notNull(),
  position: text('position').notNull(),
  image: text('image').default('/nebula-logo.png').notNull(),
  isPresident: boolean('is_president').default(false).notNull(),
});

export const officersToClubs = relations(officers, ({ one }) => ({
  club: one(club, { fields: [officers.clubId], references: [club.id] }),
}));
