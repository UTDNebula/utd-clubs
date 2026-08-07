import { z } from 'zod';
import { insertUserMetadata } from '@/server/db/models';
import { studentClassificationEnum } from '@/server/db/schema/users';
import { fileSchema, tagsSchema } from './schemas';

export const accountNameSchema = z.object({
  firstName: z.string().min(1, 'Name is required'),
  lastName: z.string().optional(),
});

const accountCollegeInfoSchemaBase = z.object({
  major: z.string().min(1, 'College major is required'),
  minor: z.string().nullable().optional(),
  studentClassification: z.enum(studentClassificationEnum.enumValues, {
    error: 'Classification is required',
  }),
  graduationDate: z.date().nullable(),
});

const accountCollegeInfoRefinement = (
  data: z.infer<typeof accountCollegeInfoSchemaBase>,
  ctx: z.RefinementCtx,
) => {
  if (
    !['Faculty', 'Staff'].includes(data.studentClassification) &&
    !data.graduationDate
  ) {
    ctx.addIssue({
      code: 'custom',
      message: 'Graduation date is required',
      path: ['graduationDate'],
    });
  }
};

export const accountCollegeInfoSchema =
  accountCollegeInfoSchemaBase.superRefine(accountCollegeInfoRefinement);

export const accountContactEmailSchema = z.object({
  contactEmail: z
    .email({
      error: 'Use your UT Dallas email ending with "@utdallas.edu"',
      pattern:
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)*utdallas\.edu$/i,
    })
    .min(1, 'Contact email is required')
    .nullable(),
});

export const accountSettingsSchema = accountNameSchema
  .extend(accountCollegeInfoSchemaBase.shape)
  .extend(accountContactEmailSchema.shape)
  .superRefine(accountCollegeInfoRefinement);

export type AccountSettingsSchema = z.infer<typeof accountSettingsSchema>;

export const accountOnboardingSchema = z.object({
  name: accountNameSchema,
  collegeInfo: accountCollegeInfoSchema,
  contactEmail: accountContactEmailSchema,
});

export type AccountOnboardingSchema = z.infer<typeof accountOnboardingSchema>;

export const userMetadataToAccountOnboardingSchema = z.codec(
  insertUserMetadata.partial().omit({ id: true }),
  accountOnboardingSchema.partial(),
  {
    decode: (userMetadata) => ({
      name: {
        firstName: userMetadata?.firstName ?? '',
        lastName: userMetadata?.lastName,
      },
      collegeInfo: {
        major: userMetadata?.major ?? '',
        minor: userMetadata?.minor,
        studentClassification: userMetadata?.studentClassification ?? 'Student',
        graduationDate: userMetadata?.graduationDate
          ? new Date(
              userMetadata?.graduationDate?.getTime() +
                userMetadata?.graduationDate?.getTimezoneOffset() * 60 * 1000,
            )
          : null,
      },
      contactEmail: {
        contactEmail: userMetadata?.contactEmail ?? '',
      },
    }),
    encode: (form) => ({
      firstName: form.name?.firstName,
      lastName: form.name?.lastName,
      major: form.collegeInfo?.major,
      minor: form.collegeInfo?.minor,
      studentClassification: form.collegeInfo?.studentClassification,
      graduationDate: form.collegeInfo?.graduationDate,
      contactEmail: form.contactEmail?.contactEmail,
    }),
  },
);

export const createClubSchema = z.object({
  name: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Character limit reached'),
    alias: z
      .string()
      .max(100, 'Character limit reached')
      .optional()
      .refine(
        (val) => val === undefined || val.length === 0 || val.length >= 2,
        {
          message: 'Alias must be at least 2 characters',
        },
      ),
  }),
  meta: z.object({
    description: z.string().min(1, 'Description is required'),
    tags: tagsSchema,
  }),
});

export type CreateClubSchema = z.infer<typeof createClubSchema>;

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
  image: fileSchema,
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
