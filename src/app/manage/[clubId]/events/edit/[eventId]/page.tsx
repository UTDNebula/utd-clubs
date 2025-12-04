import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

const EditEventPage = async (props: {
  params: Promise<{ clubId: string; eventId: string }>;
}) => {
  const { clubId, eventId } = await props.params;
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  const event = await api.event.byId({ id: eventId });
  if (!event) {
    return notFound();
  }
  const officerClubs = await api.club.getOfficerClubs();

  return (
    <>
      <ClubManageHeader
        club={club}
        path={[
          { text: 'Events', href: `/manage/${club.id}/events` },
          { text: event.name, href: `/events/${eventId}` },
          { text: 'Edit', href: `/manage/${club.id}/events/edit/${eventId}` },
        ]}
        hrefBack={`/manage/${clubId}/events`}
      ></ClubManageHeader>
      <main className="p-4">
        <EventForm
          mode="edit"
          clubId={clubId}
          officerClubs={officerClubs}
          event={{ ...event, liked: false }}
        />
      </main>
    </>
  );
};

export default EditEventPage;
