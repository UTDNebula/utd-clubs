import { getServerAuthSession } from '@src/server/auth';
import { redirect } from 'next/navigation';
import { signInRoute } from '@src/utils/redirect';
import { db } from '@src/server/db';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

import Header from '@src/components/header/BaseHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Club Match Results - Jupiter',
  description:
    'Find your club match! Generate club recommendations based on a simple form.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/club-match/results',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/club-match/results',
    description:
      'Find your club match! Generate club recommendations based on a simple form.',
  },
};

const Page = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    redirect(signInRoute('club-match'));
  }

  const user = session.user;

  const data = (
    await db.query.userAiCache.findFirst({
      where: (userAiCache) => eq(userAiCache.id, user.id),
    })
  )?.clubMatch;

  if (data == null) {
    redirect('/club-match');
  }

  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 pb-8">
        <h1 className="text-center text-4xl font-bold">Club Match Results</h1>
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {data.map((club) => (
            <Link
              key={club.id}
              href={'https://jupiter.utdnebula.com/directory/' + club.id}
              className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white px-6 py-4"
            >
              <p className="text-lg font-bold">{club.name}</p>
              <p>{club.reasoning}</p>
              <ul>
                {club.benefit.split(', ').map((benefit) => (
                  <li key={benefit} className="ml-8 list-disc">
                    {benefit.charAt(0).toUpperCase() + benefit.slice(1)}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
        <a
          href="/club-match"
          className="bg-blue-primary self-center rounded-md px-4 py-2 text-white"
        >
          Redo club match
        </a>
      </main>
    </>
  );
};

export default Page;
