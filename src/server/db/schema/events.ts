import { relations, sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { club } from './club';

export const events = pgTable('events', {
  id: text('id')
    .default(sql`nanoid(20)`)
    .primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').default('').notNull(),
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
});

export const eventsRelation = relations(events, ({ one }) => ({
  club: one(club, { fields: [events.clubId], references: [club.id] }),
}));
