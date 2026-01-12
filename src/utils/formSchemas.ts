import { z } from 'zod';
import { studentClassificationEnum } from '@src/server/db/schema/users';
import { contactSchema } from './contact';

export const accountSettingsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  major: z.string().min(1, 'College major is required'),
  minor: z.string().nullable(),
  role: z.enum(['Student', 'Student Organizer', 'Administrator']),
  studentClassification: z.enum(studentClassificationEnum.enumValues),
  graduationDate: z.date().nullable(),
  contactEmail: z
    .email({
      error: 'Use your UT Dallas email',
      pattern:
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)*utdallas\.edu$/i,
    })
    .nullable(),
});

export type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

export const accountOnboardingSchema = z.object({
  firstName: z.string().min(1, 'Name is required'),
  lastName: z.string().optional(),
  major: z.string().optional(),
  minor: z.string().nullable().optional(),
  studentClassification: z.enum(studentClassificationEnum.enumValues),
  graduationDate: z.date().nullable(),
  contactEmail: z
    .email({
      error: 'Use your UT Dallas email',
      pattern:
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)*utdallas\.edu$/i,
    })
    .min(1, 'Contact email is required')
    .nullable(),
});

export type AccountOnboardingSchema = z.infer<typeof accountOnboardingSchema>;
// export type AccountOnboardingSchema = Partial<
//   z.infer<typeof accountOnboardingSchema>
// >;

export const createClubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  tags: z
    .array(z.string().max(100, 'Character limit reached'))
    .min(2, 'Select at least 2 tags'),
});

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});

export const editClubFormSchema = z.object({
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
  profileImage: z.file().nullable(),
  bannerImage: z.file().nullable(),
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
  tags: z
    .array(z.string().max(100, 'Character limit reached'))
    .min(2, 'Select at least 2 tags'),
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
  name: z.string().min(1).max(100, 'Character limit reached'),
  location: z.string().min(1).max(100, 'Character limit reached'),
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
  image: z.file().nullable(),
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
