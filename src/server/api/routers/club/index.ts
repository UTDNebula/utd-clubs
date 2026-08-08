import { createTRPCRouter, mergeRouters } from '../../trpc';
import { clubManageRouter } from './manage';
import { clubPublicRouter } from './public';
import { userMetadataToClubsRouter } from './userMetadataToClubs';

const clubBaseRouter = createTRPCRouter({
  edit: clubManageRouter,
});

export const clubRouter = mergeRouters(
  clubBaseRouter,
  clubPublicRouter,
  userMetadataToClubsRouter,
);
