import { z } from 'zod';

export const getDeleteSchema = z.object({
  objectId: z.string(),
});

export const createUploadSchema = z.object({
  objectId: z.string(),
  mime: z.string(),
});
