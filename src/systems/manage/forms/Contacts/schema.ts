import { z } from 'zod';
import { contactSchema } from '@/lib/utils/commonSchemas';

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});
