import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ClubBody from '@src/components/club/listing/ClubBody';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import { ClubNotClaimed } from '@src/components/club/listing/ClubNotClaimed';
import ClubTitle from '@src/components/club/listing/ClubTitle';
import Header from '@src/components/header/Header';
import { api } from '@src/trpc/server';
import { convertMarkdownToPlaintext } from '@src/utils/markdown';

const ClubPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const club = await api.club.getDirectoryInfo({ slug: slug });
  if (!club) {
    // Backup: If using ID, redirect
    const clubSlugById = await api.club.getSlug({ id: slug });
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
      <main className="mb-5 flex flex-col gap-y-8 p-4 max-w-6xl mx-auto">
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
  const { slug } = await props.params;

  const club = await api.club.getDirectoryInfo({ slug: slug });

  if (!club)
    return {
      title: 'Organization not found',
      description: 'Organization not found',
    };

  // show first paragraph if it's long enough. Otherwise show the entire description
  let cleanDescription = `Learn more about ${club.name} on UTD Clubs!`;
  const textDescription = club.description.replace(/^#+.*$/gm, '');

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
    title: `${club.name}`,
    description: cleanDescription,
    openGraph: {
      url: `https://clubs.utdnebula.com/directory/${club.slug}`,
      description: cleanDescription,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `https://clubs.utdnebula.com/directory/${club.slug}`,
    },
  };
}
