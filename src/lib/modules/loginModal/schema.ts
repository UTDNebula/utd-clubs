import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Valid email required'),
  password: z.string().min(1, "Don't forget your password"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'Name is required'),
    email: z.email('Valid email required'),
    password: z
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
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
