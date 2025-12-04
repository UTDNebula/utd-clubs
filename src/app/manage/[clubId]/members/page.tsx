import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
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
      <ClubManageHeader
        club={club}
        path={[{ text: 'Members', href: `/manage/${clubId}/members` }]}
        hrefBack={`/manage/${clubId}/`}
      ></ClubManageHeader>
      <h1>Not implemented yet, sorry!</h1>
    </main>
  );
}
