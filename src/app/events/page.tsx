import { EventHeader } from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';
import EventView from './eventView';
import { type Metadata } from 'next';
import { eventParamsSchema } from '@src/utils/eventFilter';
import EventCard from '@src/components/events/EventCard';

export const metadata: Metadata = {
  title: 'Events - Jupiter',
  description: 'Get connected on campus.',
  alternates: {
    canonical: 'https://jupiter.utdnebula.com/events',
  },
  openGraph: {
    url: 'https://jupiter.utdnebula.com/events',
    description: 'Get connected on campus.',
  },
};
const Events = async ({
  searchParams,
}: {
  searchParams: (typeof eventParamsSchema)['_input'];
}) => {
  const parsed = eventParamsSchema.parse(searchParams);
  const { events } = await api.event.findByDate({
    date: parsed.date,
  });
  return (
    <main className="pb-10 ">
      <EventHeader />
      <EventView searchParams={parsed}>
        {events.map((event) => {
          return <EventCard key={event.id} event={event} />;
        })}
      </EventView>
    </main>
  );
};

export default Events;
