import 'server-only';

import { appRouter } from '@src/server/api/root';
import { createTRPCContext } from '@src/server/api/trpc';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react';

import { makeQueryClient } from './shared';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const api = appRouter.createCaller(createTRPCContext);
