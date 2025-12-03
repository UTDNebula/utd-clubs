import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import Header from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';

const EditEventPage = async (props: {
  params: Promise<{ clubId: string; eventId: string }>;
}) => {
  const { clubId, eventId } = await props.params;

  const event = await api.event.byId({ id: eventId });
  if (!event) return notFound();

  const officerClubs = await api.club.getOfficerClubs();

  return (
    <>
      <Header />
      <main className="flex flex-row justify-between gap-20 p-4">
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
