import { z } from 'zod';
import { createPasswordSchema } from '@/lib/utils/commonSchemas';

export const signInSchema = z.object({
  email: z.email('Valid email required'),
  password: z.string().min(1, "Don't forget your password"),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const createSignUpSchema = (
  options: { disableStrictPasswordRequirements?: boolean } = {},
) =>
  z
    .object({
      name: z.string().min(3, 'Name is required'),
      email: z.email('Valid email required'),
      password: createPasswordSchema(options),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: 'Passwords must match',
      path: ['confirmPassword'],
    });

export const signUpSchema = createSignUpSchema();

export type SignUpSchema = z.infer<typeof signUpSchema>;
