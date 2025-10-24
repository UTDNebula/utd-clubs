import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const forms = pgTable('feedback_form', {
  id: text('id')
    .default(sql`nanoid(20)`)
    .primaryKey(),
  rating: integer('rating').notNull(),
  likes: text('likes').default(''),
  dislikes: text('dislikes').default(''),
  features: text('features').default(''),
  submit_on: timestamp('submit_on', { withTimezone: true }).notNull(),
});
