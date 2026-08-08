import { mergeRouters } from '@/server/api/trpc';
import userPublicRouter from './userPublicRouter';
import userMetadataRouter from './userMetadataRouter';

const userRouter = mergeRouters(userPublicRouter, userMetadataRouter);

export default userRouter;
