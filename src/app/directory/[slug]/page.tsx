import Header from '@src/components/header/BaseHeader';
import ClubHeader from '@src/components/club/listing/ClubHeader';
import ClubInfoSegment from '@src/components/club/listing/ClubInfoSegment';
import ClubUpcomingEvents from '@src/components/club/listing/ClubUpcomingEvents';
import ContactInformation from '@src/components/club/listing/ContactInformation';

import { api } from '@src/trpc/server';
import { db } from '@src/server/db';
import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import NotFound from '@src/components/NotFound';
import { redirect } from 'next/navigation'

const ClubPage = async ({ params }: { params: { slug: string } }) => {
  const club = await api.club.getDirectoryInfo({ slug: params.slug });
  if (!club) {
    // Backup: If using ID, redirect
    const clubSlugById = await api.club.getSlug({ id: params.slug });
    if (clubSlugById) {
      redirect(`/directory/${clubSlugById}`)
    }
    return <NotFound elementType="Club" />;
  }

  return (
    <main className="w-full">
      <Header />
      <div className="mb-5 flex flex-col space-y-4 px-3">
        <ClubHeader club={club} />
        <ClubInfoSegment club={club} />
        <ClubUpcomingEvents clubId={club.id} />
        <ContactInformation club={club} />
      </div>
    </main>
  );
};

export default ClubPage;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = params.slug;

  const found = await db.query.club.findFirst({
    where: (club) => eq(club.slug, slug),
  });

  if (!found)
    return {
      title: 'Organization not found',
      description: 'Organization not found',
    };

  return {
    title: `${found.name} - Jupiter`,
    description: found.description.slice(0, 30) + '...',
    openGraph: {
      url: `https://jupiter.utdnebula.com/directory/${found.slug}`,
      description: found.name + ' - Jupiter',
    },
    alternates: {
      canonical: `https://jupiter.utdnebula.com/directory/${found.slug}`,
    },
  };
}
