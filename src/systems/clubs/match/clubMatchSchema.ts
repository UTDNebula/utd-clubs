import { z } from 'zod';

const characterLimitError = 'Character limit reached';

export const collegeInfoSchema = z.object({
  major: z.string().min(1, 'Major is required').max(100, characterLimitError),
  year: z.string().min(1, 'Year is required').max(100),
  proximity: z.string().min(1, 'Proximity is required').max(100),
});

export const interestsSchema = z.object({
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
  newExperiences: z.string().max(500, characterLimitError).optional(),
});

export const involvementSchema = z.object({
  involvementGoals: z.array(z.string().min(1).max(100)).max(50).optional(),
  skills: z.array(z.string().min(1).max(100)).max(50).optional(),
  gender: z.string().max(100).optional(),
  genderOther: z.string().max(500, characterLimitError).optional(),
  timeCommitment: z.string().min(1, 'Time commitment is required').max(100),
});

export const clubMatchFormSchema = collegeInfoSchema
  .extend(interestsSchema.shape)
  .extend(involvementSchema.shape);

export type ClubMatchFormSchema = z.infer<typeof clubMatchFormSchema>;

export const clubMatchWizardSchema = z.object({
  collegeInfo: collegeInfoSchema,
  interests: interestsSchema,
  involvement: involvementSchema,
});

export type ClubMatchWizardSchema = z.infer<typeof clubMatchWizardSchema>;
