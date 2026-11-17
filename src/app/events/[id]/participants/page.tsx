import { notFound } from 'next/navigation';
import ParticipantEventHeader from '@/systems/events/ParticipantList/ParticipantEventHeader';
import ParticipantList from '@/systems/events/ParticipantList/ParticipantList';
import { api } from '@/trpc/server';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await api.event.byId({ eventId: id }); //!
  if (!event) {
    notFound();
  }

  const participants = await api.event.manage.getParticipants({
    eventId: event.id,
  }); //!

  return (
    <main>
      <ParticipantEventHeader //make a participant header
        event={event}
        path={[{ text: 'Participants' }]}
        hrefBack={`/events/${id}/`}
      />
      <div className="flex w-full flex-col items-center">
        <ParticipantList participants={participants} event={event} />
      </div>
    </main>
  );
}
