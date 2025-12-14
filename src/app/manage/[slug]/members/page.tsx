import { notFound } from 'next/navigation';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  return (
    <main>
      <ManageHeader
        club={club}
        path={[{ text: 'Members', href: `/manage/${slug}/members` }]}
        hrefBack={`/manage/${slug}/`}
      />
      <h1>Not implemented yet, sorry!</h1>
    </main>
  );
}
