import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { signInRoute } from '@src/utils/redirect';
import ClubMatch from './ClubMatch';

export const metadata: Metadata = {
  title: 'Club Match',
  description:
    'Find your club match! Generate club recommendations based on a simple form.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/club-match',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/club-match',
    description:
      'Find your club match! Generate club recommendations based on a simple form.',
  },
};

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('club-match'));
  }

  const data = await db.query.userAiCache.findFirst({
    where: (userAiCache) => eq(userAiCache.id, session.user.id),
  });

  const userMetadata = await db.query.userMetadata.findFirst({
    where: (userMetadata) => eq(userMetadata.id, session.user.id),
  });

  if (data?.clubMatchLimit != null && data.clubMatchLimit <= 0) {
    redirect('/club-match/results');
  }

  return (
    <>
      <Header />
      <ClubMatch
        response={data?.responses ?? null}
        userMetadata={userMetadata ?? null}
      />
    </>
  );
};

export default Page;
