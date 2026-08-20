import Typography from '@mui/material/Typography';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Panel from '@nebula-library/components/Panel';
import Header from '@/lib/modules/navigation/header';
import { signInRoute } from '@/lib/utils/redirect';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import ClubMatchForm from '@/systems/clubs/match/ClubMatchForm';
import { api } from '@/trpc/server';

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

const Page = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('club-match'));
  }

  const [data, userMetadata] = await Promise.all([
    db.query.userAiCache.findFirst({
      where: (userAiCache) => eq(userAiCache.id, session.user.id),
    }),
    api.user.metadata.byId({ userId: session.user.id }),
  ]);

  if (data?.clubMatchLimit != null && data.clubMatchLimit <= 0) {
    redirect('/club-match/results');
  }

  return (
    <>
      <Header />
      <main className="flex w-full flex-col items-center p-4">
        <div className="flex w-full max-w-4xl flex-col items-center gap-4">
          <Typography
            variant="h1"
            className="font-display text-center text-3xl font-bold"
          >
            Find the perfect club for you
          </Typography>

          <ClubMatchForm
            response={data?.responses ?? null}
            userMetadata={userMetadata ?? null}
          />

          <Panel smallPadding className="dark:bg-neutral-700">
            <p className="text-sm text-slate-800 dark:text-slate-200">
              <span className="font-semibold">Disclaimer: </span>Club
              recommendations are generated using Google&apos;s Gemini AI. While
              we strive for accuracy, AI recommendations may not perfectly match
              your preferences. We recommend reviewing the suggested clubs to
              find the best fit for you.
            </p>
          </Panel>
        </div>
      </main>
    </>
  );
};

export default Page;
