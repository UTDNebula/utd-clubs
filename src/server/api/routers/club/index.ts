import { createTRPCRouter, mergeRouters } from '@/server/api/trpc';
import clubManageRouter from './clubManageRouter';
import clubPublicRouter from './clubPublicRouter';
import clubUserRouter from './clubUserRouter';

const clubBaseRouter = createTRPCRouter({
  edit: clubManageRouter,
});

const clubRouter = mergeRouters(
  clubBaseRouter,
  clubPublicRouter,
  clubUserRouter,
);

export default clubRouter;
