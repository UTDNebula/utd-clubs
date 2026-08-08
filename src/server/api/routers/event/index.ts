import { mergeRouters } from '@/server/api/trpc';
import eventManageRouter from './eventManageRouter';
import eventPublicRouter from './eventPublicRouter';
import eventUserRouter from './eventUserRouter';

const eventRouter = mergeRouters(
  eventPublicRouter,
  eventUserRouter,
  eventManageRouter,
);

export default eventRouter;
