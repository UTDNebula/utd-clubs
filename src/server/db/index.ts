import 'server-only';
import { drizzle } from 'drizzle-orm/neon-http';
import * as admin from './schema/admin';
import * as auth from './schema/auth';
import * as club from './schema/club';
import * as contacts from './schema/contacts';
import * as events from './schema/events';
import * as forms from './schema/forms';
import * as officers from './schema/officers';
import * as users from './schema/users';

const schema = {
  ...club,
  ...contacts,
  ...events,
  ...users,
  ...forms,
  ...admin,
  ...officers,
  ...auth,
};
if (typeof process.env.DATABASE_URL === 'undefined') {
  throw new Error('DATABASE_URL is undefined.');
}

export const db = drizzle(process.env.DATABASE_URL, {
  schema,
});
