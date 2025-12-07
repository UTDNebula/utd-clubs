import { Button } from '@mui/material';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ClubCard from '@src/components/club/ClubCard';
import Header from '@src/components/header/BaseHeader';
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
        <div className="flex items-center">
          <h1 className="font-display text-2xl font-extrabold text-haiti">
            Select a Club
          </h1>
          <Link className="ml-auto" href="/directory/create">
            <Button variant="contained" className="normal-case">
              Create New Club
            </Button>
          </Link>
        </div>
        <div className="flex justify-evenly h-full w-full flex-wrap gap-4 p-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} manageView />
          ))}
        </div>
      </main>
    </>
  );
}
