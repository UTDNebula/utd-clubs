import { relations } from 'drizzle-orm';
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { club } from './club';
import { events } from './events';

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
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.clubId] })],
);

export const userMetadataToEvents = pgTable(
  'user_metadata_to_events',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'no action' }),
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.eventId] })],
);

export const userMetadataRelation = relations(
  userMetadata,
  ({ many, one }) => ({
    clubs: many(userMetadataToClubs),
    user: one(user, {
      fields: [userMetadata.id],
      references: [user.id],
    }),
  }),
);

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

export type ClubMatchResults = {
  name: string;
  id: string;
  reasoning: string;
  benefit: string;
}[];

export type ClubMatchResponses = {
  major: string;
  year: string;
  proximity: string;
  categories: string[];
  hobbies: string[];
  gender?: string | undefined;
  timeCommitment: string;
  specificCultures?: string | undefined;
  hobbyDetails?: string | undefined;
  otherAcademicInterests?: string | undefined;
  genderOther?: string | undefined;
  newExperiences?: string | undefined;
  involvementGoals?: string[] | undefined;
  skills?: string[] | undefined;
};

export const userAiCache = pgTable('user_ai_cache', {
  id: text('id').notNull().primaryKey(),
  clubMatch: jsonb('clubMatch').$type<ClubMatchResults>(),
  clubMatchLimit: integer('clubMatchLimit').$default(() => 100),
  responses: jsonb('responses').$type<ClubMatchResponses>(),
});
