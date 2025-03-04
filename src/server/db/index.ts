import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@src/env.mjs';

import * as club from './schema/club';
import * as contacts from './schema/contacts';
import * as events from './schema/events';
import * as users from './schema/users';
import * as forms from './schema/forms';
import * as admin from './schema/admin';
import * as officers from './schema/officers';
import { neon } from '@neondatabase/serverless';

const schema = {
  ...club,
  ...contacts,
  ...events,
  ...users,
  ...forms,
  ...admin,
  ...officers,
};

const neon_client = neon(env.DATABASE_URL);
export const db = drizzle(neon_client, {
  schema,
});
