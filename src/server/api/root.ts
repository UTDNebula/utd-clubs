import { createCallerFactory, createTRPCRouter } from '@src/server/api/trpc';
import { adminRouter } from './routers/admin';
import { aiRouter } from './routers/ai';
import { clubRouter } from './routers/club';
import { eventRouter } from './routers/event';
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
  admin: adminRouter,
  storage: storageRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
