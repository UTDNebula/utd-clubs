import { z } from 'zod';
import { contactSchema } from './contact';

export const createClubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
});

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});

export const editClubSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Character limit reached'),
  tags: z.array(z.string().max(100, 'Character limit reached')),
  profileImage: z.url().nullable(),
  bannerImage: z.url().nullable(),
  foundingDate: z.date().nullable(),
});

export const editOfficerSchema = z.object({
  officers: z
    .object({
      userId: z.string(),
      name: z.string(),
      canRemove: z.boolean(),
      canTogglePresident: z.boolean(),
      position: z.enum(['President', 'Officer']),
      new: z.boolean().optional(),
    })
    .array(),
});

export const editListedOfficerSchema = z.object({
  officers: z
    .object({
      id: z.string().optional(),
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Character limit reached'),
      position: z
        .string()
        .min(1, 'Position is required')
        .max(100, 'Character limit reached'),
    })
    .array(),
});

export const editSlugSchema = z.object({
  id: z.string(),
  slug: z
    .string()
    .min(3, 'URL must be at least 3 characters')
    .max(100, 'URL may be at most 100 characters')
    .regex(
      /^[a-z0-9].*[a-z0-9]$/,
      'URL must begin and end with a lowercase letter or number',
    )
    .regex(
      /^[a-z0-9][a-z0-9-]+[a-z0-9]$/,
      'URL may only use lowercase letters, numbers, and dashes',
    ),
});

export const createEventSchema = z.object({
  clubId: z.string(),
  name: z.string().min(1).max(100, 'Character limit reached'),
  location: z.string().min(1).max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached'),
  startTime: z.date(),
  endTime: z.date(),
  image: z.url().nullable(),
});

export const updateEventSchema = createEventSchema.extend({
  id: z.string(),
});

const characterLimitError = 'Character limit reached';

export const clubMatchFormSchema = z.object({
  major: z.string().min(1, 'Major is required').max(100, characterLimitError),
  year: z.string().min(1, 'Year is required').max(100),
  proximity: z.string().min(1, 'Proximity is required').max(100),
  categories: z
    .array(z.string().min(1).max(100))
    .min(1, 'Types of organizations are required')
    .max(50),
  specificCultures: z.string().max(500, characterLimitError).optional(),
  hobbies: z
    .array(z.string().min(1).max(100))
    .min(1, 'Hobbies are required')
    .max(50),
  hobbyDetails: z.string().max(500, characterLimitError).optional(),
  otherAcademicInterests: z.string().max(500, characterLimitError).optional(),
  gender: z.string().min(1, 'Gender is required').max(100).optional(),
  genderOther: z.string().max(500, characterLimitError).optional(),
  newExperiences: z.string().max(500, characterLimitError).optional(),
  involvementGoals: z.array(z.string().min(1).max(100)).max(50).optional(),
  timeCommitment: z.string().min(1, 'Time commitment is required').max(100),
  skills: z.array(z.string().min(1).max(100)).max(50).optional(),
});
