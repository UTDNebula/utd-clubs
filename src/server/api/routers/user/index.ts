import { createTRPCRouter, mergeRouters } from '@/server/api/trpc';
import userPublicRouter from './userPublicRouter';
import userMetadataRouter from './userMetadataRouter';
import userClubsRouter from './userClubsRouter';
import userEventsRouter from './userEventsRouter';

const userBaseRouter = createTRPCRouter({
  metadata: userMetadataRouter,
  clubs: userClubsRouter,
  events: userEventsRouter,
});

const userRouter = mergeRouters(userBaseRouter, userPublicRouter);

export default userRouter;
