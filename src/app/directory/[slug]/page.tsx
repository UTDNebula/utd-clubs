import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import ClubHeader from '@src/components/club/listing/ClubHeader';
import ClubInfoSegment from '@src/components/club/listing/ClubInfoSegment';
import ClubUpcomingEvents from '@src/components/club/listing/ClubUpcomingEvents';
import ContactInformation from '@src/components/club/listing/ContactInformation';
import Header from '@src/components/header/BaseHeader';
import NotFound from '@src/components/NotFound';
import { db } from '@src/server/db';
import { api } from '@src/trpc/server';

const ClubPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const club = await api.club.getDirectoryInfo({ slug: params.slug });
  if (!club) {
    // Backup: If using ID, redirect
    const clubSlugById = await api.club.getSlug({ id: params.slug });
    if (clubSlugById) {
      redirect(`/directory/${clubSlugById}`);
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

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
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
    title: `${found.name}`,
    description: `${found.name} on UTD Clubs`,
    openGraph: {
      url: `https://clubs.utdnebula.com/directory/${found.slug}`,
      description: `${found.name} on UTD Clubs`,
    },
    alternates: {
      canonical: `https://clubs.utdnebula.com/directory/${found.slug}`,
    },
  };
}
