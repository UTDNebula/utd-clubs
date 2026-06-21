import { type Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';
import Header from '@src/components/header/Header';
import { UTDClubsLogoCombination } from '@src/icons/UTDClubsLogo';
import { auth } from '@src/server/auth';
import { ClubEvents, RegisteredEvents } from './communityEvents';

type SearchParams = { page?: string; pageSize?: string };

export const metadata: Metadata = {
  title: 'My Community',
  description: 'Your clubs & events, all in one place.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/community',
    description: 'Your clubs & events, all in one place.',
  },
};

const Community = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
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

  const sp = (await searchParams) ?? {};
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 12;

  return (
    <>
      <Header />
      <main className="p-4">
        <div className="flex min-h-16 flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <h1 className="font-display text-2xl font-bold">Community Events</h1>
        </div>
        <h2 className="font-display mt-4 px-4 text-xl font-bold">Registered</h2>
        <RegisteredEvents />
        <h2 className="font-display mt-4 px-4 text-xl font-bold">
          From Your Followed Clubs
        </h2>
        <ClubEvents page={page} pageSize={pageSize} />
      </main>
    </>
  );
};

export default Community;
