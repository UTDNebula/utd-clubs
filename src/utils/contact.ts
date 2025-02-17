import { z } from 'zod';

const emailSchema = z.object({
  platform: z.literal('email'),
  clubId: z.string().optional(),
  url: z.string().email('Must be a valid email'),
});
const discordSchema = z.object({
  platform: z.literal('discord'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const youtubeSchema = z.object({
  platform: z.literal('youtube'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const twitchSchema = z.object({
  platform: z.literal('twitch'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const facebookSchema = z.object({
  platform: z.literal('facebook'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const twitterSchema = z.object({
  platform: z.literal('twitter'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});
const instagramSchema = z.object({
  platform: z.literal('instagram'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const websiteSchema = z.object({
  platform: z.literal('website'),
  clubId: z.string().optional(),
  url: z.string().url('Valid url required'),
});

const otherSchema = z.object({
  platform: z.literal('other'),
  clubId: z.string().optional(),
  url: z.string().url('must be a valid url'),
});

export const contactSchema = z.discriminatedUnion('platform', [
  emailSchema,
  discordSchema,
  youtubeSchema,
  twitchSchema,
  facebookSchema,
  twitterSchema,
  instagramSchema,
  websiteSchema,
  otherSchema,
]);
export type contact = z.infer<typeof contactSchema>;
