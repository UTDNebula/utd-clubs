import z from 'zod';

export const gCalEventSchema = z.object({
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  recurrence: z.string().array().optional(),
  recurringEventId: z.string().optional(),
  etag: z.string(),
  location: z.string().optional(),
  start: z.object({
    date: z.iso.date().optional(),
    dateTime: z.iso.datetime({ offset: true }).optional(),
    timeZone: z.string().optional(),
  }),
  end: z.object({
    date: z.iso.date().optional(),
    dateTime: z.iso.datetime({ offset: true }).optional(),
    timeZone: z.string().optional(),
  }),
  created: z.iso.datetime(),
  updated: z.iso.datetime(),
  organizer: z
    .object({
      email: z.string(),
      displayName: z.string().optional(),
      self: z.boolean().optional(),
    })
    .optional(),
  attachments: z
    .array(
      z.object({
        fileUrl: z.string(),
        title: z.string(),
        mimeType: z.string(),
        fileId: z.string(),
      }),
    )
    .optional(),
});
