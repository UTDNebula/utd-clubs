import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ClubCard from '@src/components/club/ClubCard';
import Header from '@src/components/header/BaseHeader';
import ManageHeader from '@src/components/manage/ManageHeader';
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
        <ManageHeader>
          <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2 grow">
            <Link className="ml-auto" href="/directory/create">
              <Button
                variant="contained"
                className="normal-case whitespace-nowrap"
                startIcon={<AddIcon />}
              >
                Create New Club
              </Button>
            </Link>
          </div>
        </ManageHeader>
        <div className="flex justify-evenly h-full w-full flex-wrap gap-4 p-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} manageView />
          ))}
        </div>
      </main>
    </>
  );
}
