import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as admin from './schema/admin';
import * as auth from './schema/auth';
import * as calendarWebhooks from './schema/calendarWebhooks';
import * as club from './schema/club';
import * as contacts from './schema/contacts';
import * as events from './schema/events';
import * as membershipForms from './schema/membershipForms';
import * as officers from './schema/officers';
import * as users from './schema/users';

const schema = {
  ...club,
  ...calendarWebhooks,
  ...contacts,
  ...events,
  ...users,
  ...admin,
  ...officers,
  ...auth,
  ...membershipForms,
};
if (typeof process.env.DATABASE_URL === 'undefined') {
  throw new Error('DATABASE_URL is undefined.');
}

export const db = drizzleHttp(process.env.DATABASE_URL, {
  schema,
});

// needed for transactions on event sync
export const dbWithSessions = drizzle({
  connection: process.env.DATABASE_URL,
  ws: ws,
  schema: schema,
});
