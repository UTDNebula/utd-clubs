import { z } from 'zod';

export const tagsSchema = z
  .array(z.string())
  .min(2, 'Select at least 2 tags')
  .refine(
    (tags) => tags.every((tag) => tag.length <= 100),
    'Character limit reached',
  )
  .refine(
    (tags) => tags.every((tag) => !tag.includes(',')),
    'Tags cannot contain commas',
  );

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
];
export const fileSchema = z
  .file()
  .nullable()
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Only JPEG, PNG, and SVG formats are supported',
  )
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    'Max image size is 5MB',
  );

export const schools = z
  .enum([
    'Harry W. Bass Jr. School of Arts, Humanities, and Technology',
    'School of Behavioral and Brain Sciences',
    'School of Economic, Political and Policy Sciences',
    'Erik Jonsson School of Engineering and Computer Science',
    'School of Interdisciplinary Studies',
    'Naveen Jindal School of Management',
    'School of Natural Sciences and Mathematics',
  ])
  .array();

export const platformEnum = z.enum([
  'email',
  'discord',
  'youtube',
  'twitch',
  'facebook',
  'twitter',
  'instagram',
  'website',
  'linkedIn',
  'other',
]);
export type Platforms = z.infer<typeof platformEnum>;

function createContactSchema<T extends string>(platform: T) {
  return z.object({
    platform: z.literal(platform),
    clubId: z
      .string()
      .max(500, { message: 'Character limit reached.' })
      .optional(),
    url: z.url('Valid url required'),
  });
}
export const contactSchemas = platformEnum.options.map((platform) =>
  createContactSchema(platform),
);

export const contactSchema = z.discriminatedUnion(
  'platform',
  contactSchemas as unknown as [
    ReturnType<typeof createContactSchema<Platforms>>,
  ],
);
export type ContactSchema = z.infer<typeof contactSchema>;
