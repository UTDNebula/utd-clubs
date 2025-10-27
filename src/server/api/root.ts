import { createCallerFactory, createTRPCRouter } from '@src/server/api/trpc';
import { adminRouter } from './routers/admin';
import { clubRouter } from './routers/club';
import { eventRouter } from './routers/event';
import { formRouter } from './routers/form';
import { storageRouter } from './routers/storage';
import { userMetadataRouter } from './routers/userMetadata';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  club: clubRouter,
  event: eventRouter,
  userMetadata: userMetadataRouter,
  form: formRouter,
  admin: adminRouter,
  storage: storageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
