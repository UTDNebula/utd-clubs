import { type Metadata } from 'next';
import { ClubEvents } from '../communityEvents';

export const metadata: Metadata = {
  title: 'Events From My Clubs | My Community',
  description: 'View events from your clubs.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community/more',
  },
  openGraph: {
    title: 'Events From My Clubs | My Community',
    url: 'https://clubs.utdnebula.com/community/more',
    description: 'View events from your clubs.',
  },
};

type SearchParams = { page?: string; pageSize?: string };

const Community = async ({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) => {
  const sp = (await searchParams) ?? {};
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 12;

  return <ClubEvents page={page} pageSize={pageSize} />;
};

export default Community;
