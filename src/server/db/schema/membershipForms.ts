import { relations } from 'drizzle-orm';
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { club } from './club';

export const membershipForms = pgTable('membership_forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  displayOrder: integer('display_order'),
});

export const membershipFormsToClubs = relations(membershipForms, ({ one }) => ({
  club: one(club, { fields: [membershipForms.clubId], references: [club.id] }),
}));
