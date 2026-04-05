import { type Metadata } from 'next';
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
  const parsed = eventFiltersSchema.parse(searchParams);

  // Server-side query to avoid client-side fetching on load
  const [initialEvents, count] = await Promise.all([
    api.event.findByFilters({ filters: parsed }),
    api.event.count({ includePast: true }),
  ]);

  return (
    <>
      <EventsBody initialQueryData={initialEvents} total={count} />
    </>
  );
};

export default Events;
