import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { type z } from 'zod';
import { club } from './schema/club';
import { contacts } from './schema/contacts';
import { events } from './schema/events';
import { officers } from './schema/officers';
import { userMetadata, userMetadataToClubs } from './schema/users';

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

// Schema definition for userMetadata table
export const insertUserMetadata = createInsertSchema(userMetadata);
export const selectUserMetadata = createSelectSchema(userMetadata);

export type InsertUserMetadata = z.infer<typeof insertUserMetadata>;
export type SelectUserMetadata = z.infer<typeof selectUserMetadata>;

// Schema definition for officers table
export const insertOfficer = createInsertSchema(officers);
export const selectOfficer = createSelectSchema(officers);

export type InsertOfficer = z.infer<typeof insertOfficer>;
export type SelectOfficer = z.infer<typeof selectOfficer>;

// Schema definition for userMetadataToClubs table
export const insertUserMetadataToClubs =
  createInsertSchema(userMetadataToClubs);
export const selectUserMetadataToClubs =
  createSelectSchema(userMetadataToClubs);

export type InsertUserMetadataToClubs = z.infer<
  typeof insertUserMetadataToClubs
>;
export type SelectUserMetadataToClubs = z.infer<
  typeof selectUserMetadataToClubs
>;

// With userMetadata
export const selectUserMetadataToClubsWithUserMetadata =
  selectUserMetadataToClubs.extend({
    userMetadata: selectUserMetadata.nullable(),
  });

export type SelectUserMetadataToClubsWithUserMetadata = z.infer<
  typeof selectUserMetadataToClubsWithUserMetadata
>;
