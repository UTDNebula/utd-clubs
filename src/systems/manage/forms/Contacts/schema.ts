import { z } from 'zod';
import { contactSchema } from '@/common/utils/schemas';

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});
