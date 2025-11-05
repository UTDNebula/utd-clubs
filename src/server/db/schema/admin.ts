import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { userMetadata } from './users';

export const admin = pgTable('admin', {
  userId: text('userId')
    .notNull()
    .primaryKey()
    .references(() => userMetadata.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
});

export const adminRelations = relations(admin, ({ one }) => ({
  user: one(userMetadata),
}));
