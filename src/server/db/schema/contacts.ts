import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
import { club } from './club';

export const platformEnum = pgEnum('platform', [
  'discord',
  'youtube',
  'twitch',
  'facebook',
  'twitter',
  'instagram',
  'website',
  'email',
  'other',
]);

export const contacts = pgTable(
  'contacts',
  {
    platform: platformEnum('platform').notNull(),
    url: text('url').notNull(),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey(table.platform, table.clubId),
  }),
);

export const contactsRelation = relations(contacts, ({ one }) => ({
  club: one(club, { fields: [contacts.clubId], references: [club.id] }),
}));
