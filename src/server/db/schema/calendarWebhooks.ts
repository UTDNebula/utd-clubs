import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { club } from './club';

export const calendarWebhooks = pgTable('calendar_webhooks', {
  id: text('id').primaryKey(), // Google Channel ID
  resourceId: text('resource_id').notNull(), // from google
  clubId: text('club_id')
    .references(() => club.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').notNull(), // our security token
  expiration: timestamp('expiration').notNull(), // 7 days from creation normally
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
