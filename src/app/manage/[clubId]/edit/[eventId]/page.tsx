import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import { api } from '@src/trpc/server';

const EditEventPage = async ({
  params,
}: {
  params: { clubId: string; eventId: string };
}) => {
  const { clubId, eventId } = params;

  const event = await api.event.byId({ id: eventId });
  if (!event) return notFound();

  const officerClubs = await api.club.getOfficerClubs();

  return (
    <div className="flex flex-row justify-between gap-20 px-5">
      <EventForm
        mode="edit"
        clubId={clubId}
        officerClubs={officerClubs}
        event={{
            ...event,
            liked: false,
          }}
      />
    </div>
  );
};

export default EditEventPage;
