import { headers } from 'next/headers';
import { ReactNode } from 'react';
import CommunityHeader from '@src/components/community/CommunityHeader';
import Header from '@src/common/modules/navigation/header/Header';
import { UTDClubsLogoCombination } from '@src/icons/UTDClubsLogo';
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
        <main className="p-4">
          <div className="flex w-full justify-center">
            <UTDClubsLogoCombination
              duotone
              className="block h-[300px] w-[300px]"
              slotClassNames={{
                nebulaLogo: 'fill-haiti dark:fill-white',
                projectLogo: 'fill-royal dark:fill-cornflower-300',
              }}
            />
          </div>
          <div className="h-full">
            <h1 className="font-display pt-5 pb-1 text-center text-3xl font-bold text-slate-800 dark:text-slate-200">
              Please Sign in to Use the Community Page.
            </h1>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto mb-5 flex max-w-6xl flex-col sm:px-4">
        {/* CommunityHeader should be in layout.tsx so that it doesn't re-render between pages */}
        <CommunityHeader />
        <div className="flex flex-col gap-y-4 max-sm:px-4">{children}</div>
      </main>
    </>
  );
}
