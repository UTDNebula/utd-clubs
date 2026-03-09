import { type Metadata } from 'next';
import type z from 'zod';
import EventsBody from '@src/components/events/directory/EventsBody';
import { api } from '@src/trpc/server';
import { eventFiltersSchema, EventParamsSchema } from '@src/utils/eventFilter';

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
const Events = async (props: { searchParams: Promise<EventParamsSchema> }) => {
  const searchParams = await props.searchParams;

  // console.log('searchParams', searchParams);

  const parsed = eventFiltersSchema.parse(searchParams);
  // const events = await api.event.byDateRange({
  //   endTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year later
  // });
  // const { events } = await api.event.findByDate({
  //   date: parsed.date,
  // });

  // console.log('parsed', parsed);

  return (
    <>
      <EventsBody events={[]} />
      {/* <EventsBody events={events} /> */}
    </>
  );
};

export default Events;
