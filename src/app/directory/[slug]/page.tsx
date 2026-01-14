import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ClubBody from '@src/components/club/listing/ClubBody';
import ClubHeader from '@src/components/club/listing/ClubHeader';
import { ClubNotClaimed } from '@src/components/club/listing/ClubNotClaimed';
import ClubTitle from '@src/components/club/listing/ClubTitle';
import Header from '@src/components/header/BaseHeader';
import { convertMarkdownToPlaintext } from '@src/modules/markdown';
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
        <ClubHeader club={club} />
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

  // show first paragraph if it's long enough. Otherwise show the entire description
  let cleanDescription = `Learn more about ${found.name} on UTD Clubs!`;
  const textDescription = found.description.replace(/^#+.*$/gm, '');

  if (textDescription.length > 0) {
    const firstParagraph = textDescription.split('\n')[0];
    if (firstParagraph) {
      const plainFirstParagraph = convertMarkdownToPlaintext(firstParagraph);
      cleanDescription =
        plainFirstParagraph.length > 60
          ? plainFirstParagraph
          : convertMarkdownToPlaintext(textDescription);
    }
  }

  return {
    title: `${found.name}`,
    description: cleanDescription,
    openGraph: {
      url: `https://clubs.utdnebula.com/directory/${found.slug}`,
      description: cleanDescription,
    },
    alternates: {
      canonical: `https://clubs.utdnebula.com/directory/${found.slug}`,
    },
  };
}
