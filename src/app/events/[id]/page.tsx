import { type Metadata } from 'next';
import ClubEventHeader from '@src/components/club/listing/ClubEventHeader';
import EventBody from '@src/components/events/listing/EventBody';
import EventTitle from '@src/components/events/listing/EventTitle';
import { EventHeader } from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';

type Params = { params: Promise<{ id: string }> };

export default async function EventsPage(props: Params) {
  const params = await props.params;
  const event = await api.event.getListingInfo({ id: params.id });

  if (!event) return <div>Event Not Found.</div>;

  return (
    <>
      <EventHeader />
      <main className="mb-5 flex flex-col gap-y-6 p-4 max-w-6xl mx-auto">
        <ClubEventHeader club={event.club} />
        <EventTitle event={event} />
        <EventBody event={event} />
      </main>
    </>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;

  const event = await api.event.byId({ id: params.id });
  if (!event)
    return {
      title: 'Event not found',
      description: 'Event not found',
    };

  return {
    title: `${event.name}`,
    description: `${event.name} from ${event.club.name} on UTD Clubs`,
    alternates: {
      canonical: `https://clubs.utdnebula.com/events/${event.id}`,
    },
    openGraph: {
      url: `https://clubs.utdnebula.com/events/${event.id}`,
      description: `${event.name} from ${event.club.name} on UTD Clubs`,
    },
  };
}
