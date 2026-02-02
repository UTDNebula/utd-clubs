import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import JoinButton from '@src/components/club/JoinButton';
import { BaseCard } from '@src/components/common/BaseCard';
import Header from '@src/components/header/Header';
import { auth } from '@src/server/auth';
import { db } from '@src/server/db';
import { signInRoute } from '@src/utils/redirect';
import RedoClubMatchButton from './RedoClubMatchButton';

export const metadata: Metadata = {
  title: 'Club Match Results',
  description:
    'Find the perfect club for you! Sign in to find orgs tailored to your preferences.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/club-match/results',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/club-match/results',
    description:
      'Find the perfect club for you! Sign in to find orgs tailored to your preferences.',
  },
};

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('club-match/results'));
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
      <main className="flex flex-col gap-8 p-4 mb-5">
        <h1 className="font-display text-center text-4xl font-bold">
          Your Top Club Matches
        </h1>
        <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
          {data.clubMatch.map((club) => (
            <BaseCard
              key={club.id}
              variant="interactive"
              className="flex flex-col gap-2 p-6"
            >
              <Link href={'/directory/' + club.id}>
                <p className="line-clamp-2 text-2xl font-medium text-slate-800 dark:text-slate-200 md:text-xl">
                  {club.name}
                </p>
                <p className="text-base text-slate-600 dark:text-slate-400 md:text-sm">
                  {club.reasoning}
                </p>
                <ul>
                  {club.benefit.split(', ').map((benefit) => (
                    <li
                      key={benefit}
                      className="ml-6 list-disc text-base text-slate-600 dark:text-slate-400 md:text-sm"
                    >
                      {benefit.charAt(0).toUpperCase() + benefit.slice(1)}
                    </li>
                  ))}
                </ul>
              </Link>
              <div className="mt-auto flex flex-row space-x-2">
                <JoinButton clubId={club.id} />
              </div>
            </BaseCard>
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
