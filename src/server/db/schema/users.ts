import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { type AdapterAccount } from 'next-auth/adapters';
import { club } from './club';
import { events } from './events';
import { relations } from 'drizzle-orm';

export const yearEnum = pgEnum('year', [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  'Grad Student',
]);

export const roleEnum = pgEnum('role', [
  'Student',
  'Student Organizer',
  'Administrator',
]);

export const careerEnum = pgEnum('career', [
  'Healthcare',
  'Art and Music',
  'Engineering',
  'Business',
  'Sciences',
  'Public Service',
]);

export const clubRoleEnum = pgEnum('member_type', [
  'President',
  'Officer',
  'Member',
]);

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const userMetadata = pgTable('user_metadata', {
  id: text('id').notNull().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  major: text('major').notNull(),
  minor: text('minor'),
  year: yearEnum('year')
    .$default(() => 'Freshman')
    .notNull(),
  role: roleEnum('role')
    .$default(() => 'Student')
    .notNull(),
  career: careerEnum('career').$default(() => 'Engineering'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const userMetadataToClubs = pgTable(
  'user_metadata_to_clubs',
  {
    userId: text('user_id')
      .notNull()
      .references(() => userMetadata.id, { onDelete: 'cascade' }),
    clubId: text('club_id')
      .notNull()
      .references(() => club.id, { onDelete: 'cascade' }),
    memberType: clubRoleEnum('member_type')
      .$default(() => 'Member')
      .notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.clubId),
  }),
);

export const userMetadataToEvents = pgTable(
  'user_metadata_to_events',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.eventId),
  }),
);

export const userMetadataRelation = relations(userMetadata, ({ many }) => ({
  clubs: many(userMetadataToClubs),
}));

export const userMetadataToClubsRelations = relations(
  userMetadataToClubs,
  ({ one }) => ({
    club: one(club, {
      fields: [userMetadataToClubs.clubId],
      references: [club.id],
    }),
    userMetadata: one(userMetadata, {
      fields: [userMetadataToClubs.userId],
      references: [userMetadata.id],
    }),
  }),
);

export const userMetadataToEventsRelations = relations(
  userMetadataToEvents,
  ({ one }) => ({
    event: one(events, {
      fields: [userMetadataToEvents.eventId],
      references: [events.id],
    }),
    user: one(userMetadata, {
      fields: [userMetadataToEvents.userId],
      references: [userMetadata.id],
    }),
  }),
);
