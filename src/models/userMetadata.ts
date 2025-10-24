import { z } from 'zod';
import Career from './career';
import { selectClub as Club } from '../server/db/models';
import Role from './role';
import Year from './year';

const IUserMetadata = z.object({
  firstName: z.string(),
  lastName: z.string(),
  major: z.string(),
  minor: z.string().nullish(),
  year: Year.default('Freshman'),
  role: Role.default('Student'),
  career: Career.default('Engineering').nullable(),
  clubs: z.array(Club).optional(),
});

export default IUserMetadata;
export type UserMetadata = z.infer<typeof IUserMetadata>;
