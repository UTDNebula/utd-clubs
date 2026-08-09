import { z } from 'zod';
import { contactSchema } from '@/lib/utils/schemas';

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});
