import { z } from 'zod';
import { contactSchema } from './contact';

export const createClubSchema = z.object({
  name: z.string().min(3, 'Club name must be at least 3 characters long'),
  description: z.string().min(1, 'Description is required'),
  officers: z
    .object({
      id: z.string().min(1),
      name: z.string(),
      position: z.string().min(1),
      president: z.boolean(),
      locked: z.boolean(),
    })
    .array()
    .min(1),
  contacts: contactSchema.array(),
});
export const editClubContactSchema = z.object({
  contacts: contactSchema.array(),
});

export const editClubSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().min(1),
  tags: z.array(z.string()).optional(),
  profileImage: z.url().optional(),
  bannerImage: z.url().optional(),
  foundingDate: z.date().optional(),
});
export const editOfficerSchema = z.object({
  officers: z
    .object({
      userId: z.string(),
      name: z.string(),
      canRemove: z.boolean(),
      canTogglePresident: z.boolean(),
      position: z.enum(['President', 'Officer']),
      new: z.boolean().optional(),
    })
    .array(),
});
export const editListedOfficerSchema = z.object({
  officers: z
    .object({
      id: z.string().optional(),
      name: z.string().min(1, { message: 'Name is required.' }),
      position: z.string().min(1, { message: 'Position is required.' }),
    })
    .array(),
});

export const createEventSchema = z.object({
  clubId: z.string(),
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().max(1000),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const updateEventSchema = createEventSchema.extend({
  id: z.string(),
});

export const feedbackFormSchema = z.object({
  rating: z.number().min(1).max(10),
  likes: z.string().default(''),
  dislikes: z.string().default(''),
  features: z.string().default(''),
  submit_on: z.date().default(new Date()),
});

const characterLimitError = 'Input cannot exceed 500 characters';

export const clubMatchFormSchema = z.object({
  major: z.string().min(1).max(500, characterLimitError),
  year: z.string().min(1).max(100),
  proximity: z.string().min(1).max(100),
  categories: z.array(z.string().min(1).max(100)).max(50),
  specificCultures: z.string().max(500, characterLimitError).optional(),
  hobbies: z.array(z.string().min(1).max(100)).max(50),
  hobbiesOther: z.string().max(500, characterLimitError).optional(),
  hobbyDetails: z.string().max(500, characterLimitError).optional(),
  otherAcademicInterests: z.string().max(500, characterLimitError).optional(),
  gender: z.string().min(1).max(100),
  genderOther: z.string().max(500, characterLimitError).optional(),
  newExperiences: z.string().max(500, characterLimitError).optional(),
  involvementGoals: z.array(z.string().min(1).max(100)).max(50).optional(),
  timeCommitment: z.string().min(1).max(100),
  skills: z.array(z.string().min(1).max(100)).max(50).optional(),
});
