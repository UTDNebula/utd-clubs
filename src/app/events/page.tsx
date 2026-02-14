import { type Metadata } from 'next';
import type z from 'zod';
import EventsBody from '@src/components/events/directory/EventsBody';
import { EventHeader } from '@src/components/header/Header';
import { api } from '@src/trpc/server';
import { eventParamsSchema } from '@src/utils/eventFilter';
import EventsTitle from './EventsTitle';

export const metadata: Metadata = {
  title: 'Events',
  description: 'The place to find events at UTD.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/events',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/events',
    description: 'The place to find events at UTD.',
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
      <main className="mb-5 flex flex-col gap-y-8 sm:px-4 max-w-6xl mx-auto">
        <EventsTitle />
        <EventsBody events={events} />
      </main>
    </>
  );
};

export default Events;
