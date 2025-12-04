import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { auth } from '@src/server/auth';
import { api } from '@src/trpc/server';
import { signInRoute } from '@src/utils/redirect';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const { clubId } = await props.params;
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }
  const officerClubs = await api.club.getOfficerClubs();

  return (
    <>
      <ClubManageHeader
        club={club}
        path={[
          { text: 'Events', href: `/manage/${club.id}/events` },
          { text: 'Create', href: `/manage/${club.id}/events/create` },
        ]}
        hrefBack={`/manage/${club.id}/events`}
      ></ClubManageHeader>
      <main className="p-4">
        <EventForm clubId={club.id} officerClubs={officerClubs} />
      </main>
    </>
  );
};
export default Page;
