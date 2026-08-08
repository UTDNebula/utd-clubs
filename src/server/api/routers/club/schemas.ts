import { z } from 'zod';
import { selectContact } from '@/server/db/models';
import { clubIdSchema } from '../baseSchemas';

////////////////////////////////////////////////////////////////////////////////
// Public Router
////////////////////////////////////////////////////////////////////////////////

export const byNameSchema = z.object({
  name: z.string().default(''),
  limit: z.number().min(1).max(20).default(5),
});

export const searchSchema = z.object({
  tags: z.string().array().nullish(),
  search: z.string().nullish(),
  cursor: z.number().min(0).default(0),
  limit: z.number().min(1).max(50).default(10),
  initialCursor: z.number().min(0).default(0),
});

export const searchTagSchema = z.object({
  search: z.string(),
});

////////////////////////////////////////////////////////////////////////////////
// Manage Router
////////////////////////////////////////////////////////////////////////////////

export const eventSyncSchema = clubIdSchema.extend({
  calendarName: z.string().optional(),
  calendarId: z.string().optional(),
});

export const editContactSchema = clubIdSchema.extend({
  deleted: selectContact.shape.platform.array(),
  modified: selectContact.omit({ displayOrder: true }).array(),
  created: selectContact.omit({ clubId: true, displayOrder: true }).array(),
  order: selectContact.shape.platform.array().optional(),
});

export const editCollaboratorSchema = clubIdSchema.extend({
  deleted: z.string().array(),
  modified: z
    .object({
      userId: z.string(),
      position: z.enum(['President', 'Officer']),
    })
    .array(),
  created: z
    .object({
      userId: z.string(),
      position: z.enum(['President', 'Officer']),
    })
    .array(),
});

export const editOfficerSchema = clubIdSchema.extend({
  deleted: z.string().array(),
  modified: z
    .object({
      id: z.string(),
      name: z.string(),
      position: z.string(),
    })
    .array(),
  created: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      position: z.string(),
    })
    .array(),
  order: z.string().array().optional(),
});

export const editFormSchema = clubIdSchema.extend({
  deleted: z.string().array(),
  modified: z
    .object({
      id: z.string(),
      name: z.string(),
      url: z.url(),
    })
    .array(),
  created: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      url: z.url(),
    })
    .array(),
  order: z.string().array().optional(),
});

export const removeMembersSchema = clubIdSchema.extend({
  ids: z.union([z.string().default(''), z.string().default('').array()]),
});
