import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  // TODO: might need to add code here to only allow officers?

  const club = await api.club.byId({ id: clubId });
  if (!club) notFound();

  return (
    <main>
      <ClubManageHeader
        club={club}
        path={[{ text: 'Members' }]}
        hrefBack={`/manage/${clubId}/`}
      ></ClubManageHeader>
      <h1>Not implemented yet, sorry!</h1>
    </main>
  );
}
