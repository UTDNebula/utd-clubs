import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { getServerAuthSession } from '@src/server/auth';
import { db } from '@src/server/db';
import { signInRoute } from '@src/utils/redirect';
import RedoClubMatchButton from './RedoClubMatchButton';

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
    redirect(signInRoute('club-match/results'));
  }

  const data = await db.query.userAiCache.findFirst({
    where: (userAiCache) => eq(userAiCache.id, session.user.id),
  });

  if (data?.clubMatch == null) {
    redirect('/club-match');
  }

  return (
    <>
      <Header />
      <main className="flex flex-col gap-8 pb-8 items-center">
        <h1 className="text-center text-4xl font-bold">Club Match Results</h1>
        <div className="mx-auto flex max-w-lg flex-col gap-4">
          {data.clubMatch.map((club) => (
            <Link
              key={club.id}
              href={'https://jupiter.utdnebula.com/directory/' + club.id}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-4"
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
        {(data.clubMatchLimit == null || data.clubMatchLimit > 0) && (
          <RedoClubMatchButton />
        )}
      </main>
    </>
  );
};

export default Page;
