import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

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
      />
      <div className="p-4">
        <EventForm clubId={club.id} officerClubs={officerClubs} />
      </div>
    </>
  );
};
export default Page;
