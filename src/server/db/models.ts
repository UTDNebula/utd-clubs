import { type z } from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { club } from './schema/club';
import { contacts } from './schema/contacts';
import { events } from './schema/events';
import { userMetadata } from './schema/users';

// Schema definition for club table
export const insertClub = createInsertSchema(club);
export const selectClub = createSelectSchema(club);

export type InsertClub = z.infer<typeof insertClub>;
export type SelectClub = typeof club.$inferSelect;

// Schema definition for contacts table
export const insertContact = createInsertSchema(contacts);
export const selectContact = createSelectSchema(contacts);

export type InsertContact = z.infer<typeof insertContact>;
export type SelectContact = z.infer<typeof selectContact>;

// Schema definition for events table
export const insertEvent = createInsertSchema(events);
export const selectEvent = createSelectSchema(events);

export type InsertEvent = z.infer<typeof insertEvent>;
export type SelectEvent = z.infer<typeof selectEvent>;

// Schema types for userMetadata
export const insertUserMetadata = createInsertSchema(userMetadata);
export const selectUserMetadata = createSelectSchema(userMetadata);

export type InsertUserMetadata = z.infer<typeof insertUserMetadata>;
export type SelectUserMetadata = z.infer<typeof selectUserMetadata>;
