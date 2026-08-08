import { mergeRouters } from '../../trpc';
import { userPublicRouter } from './public';
import { userMetadataRouter } from './userMetadata';

export const userRouter = mergeRouters(userMetadataRouter, userPublicRouter);
