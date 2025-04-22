import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { type Metadata } from 'next';
import Image from 'next/image';
import React from 'react';
import CommunityEvents from './communityEvents';

export const metadata: Metadata = {
  title: 'My Community - Jupiter',
  description: 'Community Page',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/community',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/community',
    description: 'My Community - Jupiter',
  },
};

const Community = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <main className="h-full ">
        <Header />
        <div className="flex w-full place-content-center items-center pt-20">
          <Image src="/nebula-logo.png" alt="" width={300} height={300} />
        </div>
        <div className="h-full">
          <h1 className=" text-black-500 pb-1 pt-5 text-center text-3xl font-bold">
            Please Sign in to Use the Community Page.
          </h1>
        </div>
      </main>
    );
  }
  return (
    <main className="h-full ">
      <Header />
      <div className="mx-6 h-full p-2">
        <h1 className="text-2xl font-bold text-slate-500">Community Events</h1>
        <CommunityEvents />
      </div>
    </main>
  );
};

export default Community;
