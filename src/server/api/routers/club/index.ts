import { createTRPCRouter, mergeRouters } from '@/server/api/trpc';
import clubManageRouter from './clubManageRouter';
import clubPublicRouter from './clubPublicRouter';

const clubBaseRouter = createTRPCRouter({
  manage: clubManageRouter,
});

const clubRouter = mergeRouters(clubBaseRouter, clubPublicRouter);

export default clubRouter;
