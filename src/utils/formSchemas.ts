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
});
export const editOfficerSchema = z.object({
  officers: z
    .object({
      userId: z.string(),
      name: z.string(),
      locked: z.boolean(),
      title: z.string().min(1),
      position: z.enum(['President', 'Officer']),
    })
    .array(),
});
export const editListedOfficerSchema = z.object({
  officers: z
    .object({
      id: z.string().optional(),
      name: z.string(),
      position: z.string().min(1),
      isPresident: z.boolean(),
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

export const feedbackFormSchema = z.object({
  rating: z.number().min(1).max(10),
  likes: z.string().default(''),
  dislikes: z.string().default(''),
  features: z.string().default(''),
  submit_on: z.date().default(new Date()),
});

export const clubMatchFormSchema = z.object({
  major: z.string().min(1),
  year: z.string().min(1),
  proximity: z.string().min(1),
  categories: z.array(z.string().min(1)),
  specificCultures: z.string().optional(),
  hobbies: z.array(z.string().min(1)),
  hobbiesOther: z.string().optional(),
  hobbyDetails: z.string().optional(),
  otherAcademicInterests: z.string().optional(),
  gender: z.string().min(1),
  genderOther: z.string().optional(),
  newExperiences: z.string().optional(),
  involvementGoals: z.array(z.string().min(1)).optional(),
  timeCommitment: z.string().min(1),
  skills: z.array(z.string().min(1)).optional(),
});
