import { z } from 'zod';
import { selectContact } from '@/server/db/models';

export const byNameSchema = z.object({
  name: z.string().default(''),
  limit: z.number().min(1).max(20).default(5),
});

export const byIdSchema = z.object({
  id: z.string().default(''),
});

export const bySlugSchema = z.object({
  slug: z.string().default(''),
});

export const joinLeaveSchema = z.object({
  clubId: z.string().default(''),
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

export const eventSyncSchema = z.object({
  clubId: z.string(),
  calendarName: z.string().optional(),
  calendarId: z.string().optional(),
});

export const editContactSchema = z.object({
  clubId: z.string(),
  deleted: selectContact.shape.platform.array(),
  modified: selectContact.omit({ displayOrder: true }).array(),
  created: selectContact.omit({ clubId: true, displayOrder: true }).array(),
  order: selectContact.shape.platform.array().optional(),
});

export const editCollaboratorSchema = z.object({
  clubId: z.string(),
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

export const editOfficerSchema = z.object({
  clubId: z.string(),
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

export const editFormSchema = z.object({
  clubId: z.string(),
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

export const deleteSchema = z.object({ id: z.string() });

export const removeMembersSchema = z.object({
  clubId: z.string(),
  ids: z.union([z.string().default(''), z.string().default('').array()]),
});
