import { createTRPCRouter, mergeRouters } from '@/server/api/trpc';
import clubManageRouter from './clubManageRouter';
import clubPublicRouter from './clubPublicRouter';

const clubBaseRouter = createTRPCRouter({
  edit: clubManageRouter,
});

const clubRouter = mergeRouters(clubBaseRouter, clubPublicRouter);

export default clubRouter;
