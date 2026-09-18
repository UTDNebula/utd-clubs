import { z } from 'zod';
import { insertUserMetadata } from '@/server/db/models';
import { studentClassificationEnum } from '@/server/db/schema/users';

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

export const changeEmailSchema = z.object({
  newEmail: z.email('Valid email required'),
});

export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z
      .string()
      .min(8, { error: 'Must be at least 8 characters' })
      .superRefine((val, ctx) => {
        const fulfilledRequirements = {
          lowercase: /[a-z]/.test(val),
          uppercase: /[A-Z]/.test(val),
          number: /[0-9]/.test(val),
          symbol: /[`~!@#$%^&*()\-_=+\[{\]}|;:'",<.>/?]/.test(val),
        };

        const sum = Object.values(fulfilledRequirements).reduce(
          (acc, val) => acc + Number(val),
          0,
        );

        if (sum < 3) {
          ctx.addIssue({
            code: 'custom',
            message:
              'Must have at least 3 of the following: lowercase, uppercase, number, symbol',
          });
        }
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
