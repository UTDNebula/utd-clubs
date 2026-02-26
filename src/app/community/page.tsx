import { type Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import React from 'react';
import Header from '@src/components/header/Header';
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
          <div className="flex w-full place-content-center items-center pt-20">
            <Image src="/nebula-logo.png" alt="" width={300} height={300} />
          </div>
          <div className="h-full">
            <h1 className="font-display text-black-500 pt-5 pb-1 text-center text-3xl font-bold">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 min-h-16 px-4">
          <h1 className="font-display text-2xl font-bold">Community Events</h1>
        </div>
        <h2 className="font-display text-xl font-bold mt-4 px-4">Registered</h2>
        <RegisteredEvents />
        <h2 className="font-display text-xl font-bold mt-4 px-4">
          From Your Followed Clubs
        </h2>
        <ClubEvents page={page} pageSize={pageSize} />
      </main>
    </>
  );
};

export default Community;
