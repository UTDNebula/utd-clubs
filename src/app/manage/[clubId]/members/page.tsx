import { notFound } from 'next/navigation';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  return (
    <main>
      <ManageHeader
        club={club}
        path={[{ text: 'Members', href: `/manage/${clubId}/members` }]}
        hrefBack={`/manage/${clubId}/`}
      />
      <h1>Not implemented yet, sorry!</h1>
    </main>
  );
}
