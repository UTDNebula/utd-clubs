import { mergeRouters } from '../../trpc';
import { eventManageRouter } from './manage';
import { eventPublicRouter } from './public';
import { userMetadataToEventsRouter } from './userMetadataToEvents';

export const eventRouter = mergeRouters(
  eventPublicRouter,
  userMetadataToEventsRouter,
  eventManageRouter,
);
