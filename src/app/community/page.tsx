import { type Metadata } from 'next';
import { ClubEvents, RegisteredEvents } from './communityEvents';

type SearchParams = { page?: string; pageSize?: string };

export const metadata: Metadata = {
  title: 'My Community',
  description: 'Your clubs & events, all in one place.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/community',
    description: 'Your clubs & events, all in one place.',
  },
};

const Community = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const sp = (await searchParams) ?? {};
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 12;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 min-h-16 px-4">
        <h1 className="font-display text-2xl font-bold">Community Events</h1>
      </div>
      <h2 className="font-display text-xl font-bold mt-4 px-4">Registered</h2>
      <RegisteredEvents />
      <h2 className="font-display text-xl font-bold mt-4 px-4">
        From Your Followed Clubs
      </h2>
      <ClubEvents page={page} pageSize={pageSize} />
    </>
  );
};

export default Community;
