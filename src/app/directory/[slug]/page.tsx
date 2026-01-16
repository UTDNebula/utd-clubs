import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ClubBody from '@src/components/club/listing/ClubBody';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import { ClubNotClaimed } from '@src/components/club/listing/ClubNotClaimed';
import ClubTitle from '@src/components/club/listing/ClubTitle';
import Header from '@src/components/header/BaseHeader';
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
    notFound();
  }

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return (
    <>
      <Header />
      <main className="mb-5 flex flex-col gap-y-6 p-4 max-w-6xl mx-auto">
        <ClubEventHeader club={club} />
        <ClubTitle club={club} />
        <ClubBody club={club} />
        {(club.updatedAt == null || club.updatedAt < oneYearAgo) && (
          <ClubNotClaimed />
        )}
      </main>
    </>
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
