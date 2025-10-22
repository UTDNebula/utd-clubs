'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TRPCReactProvider } from '@src/trpc/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
