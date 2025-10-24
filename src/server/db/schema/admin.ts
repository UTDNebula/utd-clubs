import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userMetadata } from './users';
import { relations } from 'drizzle-orm';
import { club } from './club';

export const admin = pgTable('admin', {
  userId: text('userId')
    .notNull()
    .primaryKey()
    .references(() => userMetadata.id, {
      onDelete: 'cascade',
      onUpdate: 'no action',
    }),
});

export const carousel = pgTable('carousel', {
  orgId: text('orgId')
    .notNull()
    .primaryKey()
    .references(() => club.id, { onDelete: 'cascade', onUpdate: 'no action' }),
  startTime: timestamp('startTime', { withTimezone: true }).notNull(),
  endTime: timestamp('endTime', { withTimezone: true }).notNull(),
});

export const carouselRelations = relations(carousel, ({ one }) => ({
  club: one(club, {
    fields: [carousel.orgId],
    references: [club.id],
  }),
}));

export const adminRelations = relations(admin, ({ one }) => ({
  user: one(userMetadata),
}));
