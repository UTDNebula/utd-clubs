import { z } from 'zod';
import { imageSchema } from '@/lib/utils/commonSchemas';

const baseEventFormSchema = z.object({
  clubId: z.string(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached'),
  startTime: z.date('Invalid date'),
  endTime: z.date('Invalid date'),
  image: imageSchema,
});

export const createEventFormSchema = baseEventFormSchema.refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  },
);

const baseEventSchema = baseEventFormSchema.omit({
  image: true,
});

export const createEventSchema = baseEventSchema.refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  },
);

export const editEventFormSchema = baseEventFormSchema.refine(
  (data) => data.endTime > data.startTime,
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  },
);

export const editEventSchema = baseEventSchema
  .extend({
    image: z.url().nullable(),
    id: z.string(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });
