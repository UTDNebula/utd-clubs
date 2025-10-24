import 'server-only';

import { createTRPCContext } from '@src/server/api/trpc';
import { cache } from 'react';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { appRouter } from '@src/server/api/root';
import { makeQueryClient } from './shared';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const api = appRouter.createCaller(createTRPCContext);
