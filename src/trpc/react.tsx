'use client';

import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, loggerLink, httpBatchLink } from '@trpc/client';
import { useState } from 'react';

import { type AppRouter } from '@src/server/api/root';
import { getUrl, makeQueryClient, transformer } from './shared';
import { createTRPCContext } from '@trpc/tanstack-react-query';

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
    </QueryClientProvider>
  );
}
