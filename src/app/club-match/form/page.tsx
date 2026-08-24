import Typography from '@mui/material/Typography';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/lib/modules/navigation/header';
import Image from 'next/image';
import { signInRoute } from '@/lib/utils/redirect';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import ClubMatchDisclaimer from '@/systems/clubs/match/ClubMatchDisclaimer';
import ClubMatchForm from '@/systems/clubs/match/ClubMatchForm';
import { api } from '@/trpc/server';

export const metadata: Metadata = {
  title: 'Club Match Form',
  description:
    'Find the perfect club for you! UTD Clubs recommends orgs tailored to your preferences.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/club-match/form',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/club-match/form',
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
    redirect('/club-match');
  }

  return (
    <>
      <main className="relative min-h-screen">
        <div className="bg-royal fixed inset-0 h-full w-full overflow-hidden">
          <Image
            src={'/banner.png'}
            alt="background"
            fill
            className="-z-20 -scale-x-100 object-cover select-none"
            draggable={false}
          />
          <div className="dark:bg-slightly-darken absolute inset-0" />
        </div>
        <div className="relative z-20">
          <div className="pointer-events-none fixed inset-0 z-10 h-24 w-full bg-black/20 mask-b-from-0 max-2xl:backdrop-blur-lg" />
          <Header
            transparent
            color="light"
            itemVisibility={{ search: false, children: false }}
          />

          <div className="flex w-full flex-col items-center p-4">
            <div className="flex w-full max-w-4xl flex-col items-center gap-8 pb-24">
              <Typography
                variant="h1"
                className="font-display mx-4 flex items-center gap-2 text-center text-3xl font-bold text-white"
              >
                Find your perfect club at UTD!
                <ClubMatchDisclaimer />
              </Typography>
              <ClubMatchForm
                response={data?.responses ?? null}
                userMetadata={userMetadata ?? null}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
