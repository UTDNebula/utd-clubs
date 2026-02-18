import { type Metadata } from 'next';
import type z from 'zod';
import EventsBody from '@src/components/events/directory/EventsBody';
import { api } from '@src/trpc/server';
import { eventParamsSchema } from '@src/utils/eventFilter';

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
  const events = await api.event.byDateRange({
    endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year later
  });
  // const { events } = await api.event.findByDate({
  //   date: parsed.date,
  // });

  return (
    <>
      <EventsBody events={events} />
    </>
  );
};

export default Events;
