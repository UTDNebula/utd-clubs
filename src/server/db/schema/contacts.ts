import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
} from 'drizzle-orm/pg-core';
import { club } from './club';

export const platformEnum = pgEnum('platform', [
  'discord',
  'instagram',
  'website',
  'email',
  'twitter',
  'facebook',
  'youtube',
  'twitch',
  'linkedIn',
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
    displayOrder: integer('display_order'),
  },
  (t) => [primaryKey({ columns: [t.platform, t.clubId] })],
);

export const contactsRelation = relations(contacts, ({ one }) => ({
  club: one(club, { fields: [contacts.clubId], references: [club.id] }),
}));

export const startContacts: Array<(typeof platformEnum.enumValues)[number]> = [
  'discord',
  'instagram',
  'website',
  'email',
  'twitter',
  'facebook',
  'youtube',
  'twitch',
  'linkedIn',
  'other',
];

export const contactNames: {
  [key in (typeof platformEnum.enumValues)[number]]: string;
} = {
  discord: 'Discord',
  instagram: 'Instagram',
  website: 'Website',
  email: 'Email',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
  twitch: 'Twitch',
  linkedIn: 'LinkedIn',
  other: 'Other',
};
