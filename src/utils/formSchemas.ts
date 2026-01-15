import { z } from 'zod';
import { contactSchema } from './contact';

const tagsSchema = z
  .array(z.string())
  .min(2, 'Select at least 2 tags')
  .refine(
    (tags) => tags.every((tag) => tag.length <= 100),
    'Character limit reached',
  )
  .refine(
    (tags) => tags.every((tag) => !tag.includes(',')),
    'Tags cannot contain commas',
  );

export const createClubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  tags: tagsSchema,
});

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
];
const fileSchema = z
  .file()
  .nullable()
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only JPEG, PNG, and SVG formats are supported',
  )
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max image size is 5MB',
  );

export const editClubFormSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  alias: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Character limit reached')
    .nullable(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Character limit reached'),
  tags: tagsSchema,
  profileImage: fileSchema,
  bannerImage: fileSchema,
  foundingDate: z.date().nullable(),
});

export const editClubDetailsSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Character limit reached'),
  tags: tagsSchema,
  profileImage: z.url().optional(),
  bannerImage: z.url().optional(),
  foundingDate: z.date().nullable(),
});

export const editOfficerSchema = z.object({
  officers: z
    .object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
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
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  location: z
    .string()
    .min(1, 'Location must be at least 3 characters')
    .max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached'),
  startTime: z.date(),
  endTime: z.date(),
});

export const updateEventSchema = createEventSchema.extend({
  image: z.url().nullable(),
  id: z.string(),
});

export const eventFormSchema = z.object({
  clubId: z.string(),
  name: z.string().min(1).max(100, 'Character limit reached'),
  location: z.string().min(1).max(100, 'Character limit reached'),
  description: z.string().max(1000, 'Character limit reached'),
  startTime: z.date(),
  endTime: z.date(),
  image: fileSchema,
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
  gender: z.string().max(100).optional(),
  genderOther: z.string().max(500, characterLimitError).optional(),
  newExperiences: z.string().max(500, characterLimitError).optional(),
  involvementGoals: z.array(z.string().min(1).max(100)).max(50).optional(),
  timeCommitment: z.string().min(1, 'Time commitment is required').max(100),
  skills: z.array(z.string().min(1).max(100)).max(50).optional(),
});
