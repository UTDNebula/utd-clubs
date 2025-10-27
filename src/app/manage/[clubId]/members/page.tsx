import { api } from '@src/trpc/server';
// import Header from '@src/components/header/BaseHeader';
import { notFound } from 'next/navigation';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
// import PillButton from '@src/components/PillButton';

export default async function Page({ params }: { params: { clubId: string } }) {
  // TODO: might need to add code here to only allow officers?
  const club = await api.club.byId({ id: params.clubId });
  if (!club) notFound();

  return (
    <main>
      {/* <Header /> */}
      <ClubManageHeader
        club={club}
        path={[{ text: 'Members' }]}
      ></ClubManageHeader>
      <h1>
        Not implemented yet, sorry!
      </h1>
    </main>
  );
}
