import { z } from 'zod';
import { contactSchema } from '@/common/utils/contact';

export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});
