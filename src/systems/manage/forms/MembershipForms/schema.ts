import { z } from 'zod';

export const editListedMembershipFormSchema = z.object({
  membershipForms: z
    .object({
      id: z.string().optional(),
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Character limit reached'),
      url: z
        .url({
          message:
            'Please enter a valid URL (must start with http:// or https://)',
        })
        .min(1, 'URL is required'),
    })
    .array(),
});
