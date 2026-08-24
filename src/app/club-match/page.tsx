import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BaseCard } from '@nebula-library/components/BaseCard';
import { LinkButton } from '@/lib/components/LinkButton';
import { Binoculars } from '@/lib/icons/OtherIcons';
import Header from '@/lib/modules/navigation/header';
import { signInRoute } from '@/lib/utils/redirect';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import JoinButton from '@/systems/clubs/JoinButton';
import ClubMatchDisclaimer from '@/systems/clubs/match/ClubMatchDisclaimer';
import RedoClubMatchButton from '@/systems/clubs/match/RedoClubMatchButton';

export const metadata: Metadata = {
  title: 'Club Match',
  description:
    'Find the perfect club for you! UTD Clubs recommends orgs tailored to your preferences.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/club-match',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/club-match',
    description:
      'Find the perfect club for you! UTD Clubs recommends orgs tailored to your preferences.',
  },
};

const dummyClubNames = [
  'Super Cool Club',
  'Amazing Organization',
  'Really Fun Greek Life',
];

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('club-match'));
  }

  const data = await db.query.userAiCache.findFirst({
    where: (userAiCache) => eq(userAiCache.id, session.user.id),
  });

  if (data?.clubMatch == null) {
    return (
      <>
        <Header />
        <main className="mx-auto mb-5 flex max-w-6xl flex-col sm:px-4">
          <div className="my-8 flex flex-col gap-y-8 max-sm:px-4">
            <Typography
              variant="h1"
              className="font-display mx-4 flex items-center justify-center gap-2 text-center text-4xl font-bold"
            >
              Club Match
              <ClubMatchDisclaimer />
            </Typography>

            <BaseCard className="mx-8 flex max-w-lg grow flex-col items-center gap-6 self-center px-8 py-6">
              <p>
                Want to quickly find clubs that match your hobbies and
                interests? Take this quiz and get intelligently matched with
                student organizations at UTD that you may find interesting!
              </p>
              <LinkButton
                href="/club-match/form"
                size="large"
                color="primary"
                variant="contained"
                startIcon={<Binoculars />}
              >
                Start now!
              </LinkButton>
            </BaseCard>

            <Divider variant="middle" />

            <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
              {Array.from({ length: 3 }, (_, index) => (
                <BaseCard
                  key={index}
                  className="flex h-64 w-80 flex-col gap-2 rounded-lg mask-b-from-0 p-6 select-none"
                >
                  <p className="line-clamp-2 text-2xl font-medium text-slate-800 opacity-50 md:text-xl dark:text-slate-200">
                    {dummyClubNames[index]}
                  </p>
                  <p className="text-base text-slate-600 md:text-sm dark:text-slate-400">
                    <Skeleton animation={false} />
                  </p>
                  <ul>
                    {Array.from({ length: 3 }, (_, index) => (
                      <li
                        key={index}
                        className="ml-6 list-disc text-base text-slate-600 md:text-sm dark:text-slate-400"
                      >
                        <Skeleton animation={false} />
                      </li>
                    ))}
                  </ul>
                </BaseCard>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto mb-5 flex max-w-6xl flex-col sm:px-4">
        <div className="flex flex-col gap-y-4 max-sm:px-4">
          <Typography
            variant="h1"
            className="font-display mx-4 my-8 flex items-center justify-center gap-2 text-center text-4xl font-bold"
          >
            Your Top Club Matches
            <ClubMatchDisclaimer />
          </Typography>
          <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4">
            {data.clubMatch.map((club) => (
              <BaseCard
                key={club.id}
                variant="interactive"
                className="flex flex-col gap-2 p-6"
              >
                <Link href={'/directory/' + club.id}>
                  <p className="line-clamp-2 text-2xl font-medium text-slate-800 md:text-xl dark:text-slate-200">
                    {club.name}
                  </p>
                  <p className="text-base text-slate-600 md:text-sm dark:text-slate-400">
                    {club.reasoning}
                  </p>
                  <ul>
                    {club.benefit.split(', ').map((benefit) => (
                      <li
                        key={benefit}
                        className="ml-6 list-disc text-base text-slate-600 md:text-sm dark:text-slate-400"
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
        </div>
      </main>
    </>
  );
};

export default Page;
