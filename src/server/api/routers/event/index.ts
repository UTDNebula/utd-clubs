import { mergeRouters } from '@/server/api/trpc';
import eventManageRouter from './eventManageRouter';
import eventPublicRouter from './eventPublicRouter';

const eventRouter = mergeRouters(eventPublicRouter, eventManageRouter);

export default eventRouter;
