import { type Metadata } from 'next';
import type z from 'zod';
import EventCard from '@src/components/events/EventCard';
import { EventHeader } from '@src/components/header/BaseHeader';
import { api } from '@src/trpc/server';
import { eventParamsSchema } from '@src/utils/eventFilter';
import EventsTitle from './EventsTitle';

export const metadata: Metadata = {
  title: 'Events',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/events',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/events',
  },
};
const Events = async (props: {
  searchParams: Promise<z.input<typeof eventParamsSchema>>;
}) => {
  const searchParams = await props.searchParams;
  const parsed = eventParamsSchema.parse(searchParams);
  const { events } = await api.event.findByDate({
    date: parsed.date,
  });

  return (
    <>
      <EventHeader />
      <main className="w-full p-4">
        <EventsTitle date={parsed.date} />
        <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
          {events.map((event) => {
            return <EventCard key={event.id} event={event} />;
          })}
        </div>
      </main>
    </>
  );
};

export default Events;
