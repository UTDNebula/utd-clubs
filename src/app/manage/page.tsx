import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from '@src/components/header/BaseHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';
import ClubCard from './ClubCard';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(await signInRoute('manage'));
  }
  const clubs = await api.club.getOfficerClubs();
  return (
    <main className="">
      <Header />
      <div className="px-5">
        <div className="flex flex-row">
          <h1 className="from-royal bg-linear-to-br to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent">
            Select a Club
          </h1>
          <Link
            className="bg-royal ml-auto rounded-lg px-2.5 py-2 font-bold text-white shadow-xs"
            href={'/directory/create'}
          >
            create new club
          </Link>
        </div>
        <div className="flex h-full w-full flex-wrap gap-4 p-4">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </main>
  );
}
