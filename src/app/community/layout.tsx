import { headers } from 'next/headers';
import { ReactNode } from 'react';
import RequireLogin from '@src/components/auth/RequireLogin';
import CommunityTitle from '@src/components/community/CommunityTitle';
import Header from '@src/components/header/Header';
import { auth } from '@src/server/auth';

type CommunityLayoutProps = {
  children: ReactNode;
};

export default async function CommunityLayout({
  children,
}: CommunityLayoutProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <>
        <Header />
        <RequireLogin byline="...to access the community page" />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mb-5 flex flex-col sm:px-4 max-w-6xl mx-auto">
        {/* CommunityTitle should be in layout.tsx so that it doesn't re-render between pages */}
        <CommunityTitle />
        <div className="flex flex-col gap-y-4 max-sm:px-4">{children}</div>
      </main>
    </>
  );
}
