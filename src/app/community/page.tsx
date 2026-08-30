import { type Metadata } from 'next';
import { headers } from 'next/headers';
import { auth } from '@/server/auth';
import ClubEvents from '@/systems/dashboard/ClubEvents';
import RegisteredEvents from '@/systems/dashboard/RegisteredEvents';

type SearchParams = { page?: string; pageSize?: string };

export const metadata: Metadata = {
  title: 'My Events | My Community',
  description: 'Your clubs & events, all in one place.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community',
  },
  openGraph: {
    title: 'My Events | My Community',
    url: 'https://clubs.utdnebula.com/community',
    description: 'Your clubs & events, all in one place.',
  },
};

const Community = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const [session, sp] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    searchParams,
  ]);
  if (!session) return;

  const page = Number(sp?.page) || 1;
  const pageSize = Number(sp?.pageSize) || 12;

  return (
    <div>
      <h2 className="font-display mt-4 px-4 text-xl font-bold">Registered</h2>
      <RegisteredEvents />
      <h2 className="font-display mt-4 px-4 text-xl font-bold">
        From Your Followed Clubs
      </h2>
      <ClubEvents page={page} pageSize={pageSize} />
    </div>
  );
};

export default Community;
