'use client';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { lazy, useState } from 'react';
import { type AppRouter } from '@src/server/api/root';
import { getUrl, makeQueryClient, transformer } from './shared';

const Devtools =
  process.env.NODE_ENV === 'development'
    ? lazy(() => import('../components/TanstackDevtools'))
    : () => null;

let browserQueryClient: QueryClient;

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer,
          url: getUrl(),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
      <Devtools />
    </QueryClientProvider>
  );
}
