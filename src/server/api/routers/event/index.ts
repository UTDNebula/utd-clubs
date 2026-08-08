import { createTRPCRouter, mergeRouters } from '@/server/api/trpc';
import eventManageRouter from './eventManageRouter';
import eventPublicRouter from './eventPublicRouter';

const eventBaseRouter = createTRPCRouter({
  manage: eventManageRouter,
});

const eventRouter = mergeRouters(eventBaseRouter, eventPublicRouter);

export default eventRouter;
