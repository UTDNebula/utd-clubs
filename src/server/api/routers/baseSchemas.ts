import { z } from 'zod';

export const clubIdSchema = z.object({
  clubId: z.string(),
});

export const clubSlugSchema = z.object({
  slug: z.string(),
});

export const eventIdSchema = z.object({
  eventId: z.string(),
});

export const userIdSchema = z.object({
  userId: z.string(),
});
