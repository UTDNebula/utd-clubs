'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { TRPCReactProvider } from '@src/trpc/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
