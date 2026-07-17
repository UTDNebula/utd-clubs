import AddIcon from '@mui/icons-material/Add';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ClubCard from '@src/components/club/ClubCard';
import Header from '@src/components/header/Header';
import { LinkButton } from '@src/components/LinkButton';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

export const metadata: Metadata = {
  title: 'Manage Clubs',
  description: 'Sign in to edit your club listings.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/manage',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/manage',
    description: 'Sign in to edit your club listings.',
  },
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(await signInRoute('manage'));
  }
  const clubs = await api.club.getOfficerClubs();
  return (
    <>
      <Header />
      <main className="p-4">
        <div className="flex min-h-16 flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <h1 className="font-display text-2xl font-bold">Manage Clubs</h1>
          <div className="flex grow flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
            <LinkButton
              href="/directory/create"
              variant="contained"
              className="ml-auto whitespace-nowrap normal-case"
              startIcon={<AddIcon />}
            >
              Create New Club
            </LinkButton>
          </div>
        </div>
        <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pt-6 pb-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} manageView />
          ))}
        </div>
      </main>
    </>
  );
}
