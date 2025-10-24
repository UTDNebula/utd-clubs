import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { club } from './club';

export const events = pgTable('events', {
  id: text('id')
    .default(sql`nanoid(20)`)
    .primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => club.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  location: text('location').default('').notNull(),
});

export const eventsRelation = relations(events, ({ one }) => ({
  club: one(club, { fields: [events.clubId], references: [club.id] }),
}));
