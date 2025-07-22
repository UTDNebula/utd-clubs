import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';
import { db } from '@src/server/db';
import { eq } from 'drizzle-orm';

import Header from '@src/components/header/BaseHeader';
import type { Metadata } from 'next';

import ClubMatch from './ClubMatch';

export const metadata: Metadata = {
  title: 'Club Match - Jupiter',
  description:
    'Find your club match! Generate club recommendations based on a simple form.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/club-match',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/club-match',
    description:
      'Find your club match! Generate club recommendations based on a simple form.',
  },
};

const Page = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(signInRoute('club-match'));
  }

  const data = await db.query.userAiCache.findFirst({
    where: (userAiCache) => eq(userAiCache.id, session.user.id),
  });

  if (data?.clubMatchLimit != null && data.clubMatchLimit <= 0) {
    redirect('/club-match/results');
  }

  return (
    <>
      <Header />
      <ClubMatch />
    </>
  );
};

export default Page;
