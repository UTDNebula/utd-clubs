import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ClubCard from '@src/components/club/ClubCard';
import Header from '@src/components/header/Header';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 min-h-16 px-4">
          <h1 className="font-display text-2xl font-bold">Manage Clubs</h1>
          <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2 grow">
            <Button
              LinkComponent={Link}
              href="/directory/create"
              variant="contained"
              className="normal-case whitespace-nowrap ml-auto"
              startIcon={<AddIcon />}
            >
              Create New Club
            </Button>
          </div>
        </div>
        <div className="grid w-full auto-rows-fr grid-cols-[repeat(auto-fill,320px)] justify-center gap-16 pb-4 pt-6">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} manageView />
          ))}
        </div>
      </main>
    </>
  );
}
