import { type Metadata } from 'next';
import type z from 'zod';
import EventCard from '@src/components/events/EventCard';
import { EventHeader } from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';
import { eventParamsSchema } from '@src/utils/eventFilter';
import EventView from './eventView';

export const metadata: Metadata = {
  title: 'Events',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/events',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/events',
  },
};
const Events = async ({
  searchParams,
}: {
  searchParams: z.input<typeof eventParamsSchema>;
}) => {
  const parsed = eventParamsSchema.parse(searchParams);
  const { events } = await api.event.findByDate({
    date: parsed.date,
  });

  return (
    <main className="pb-10">
      <EventHeader />
      <EventView date={parsed.date}>
        {events.map((event) => {
          return <EventCard key={event.id} event={event} />;
        })}
      </EventView>
    </main>
  );
};

export default Events;
