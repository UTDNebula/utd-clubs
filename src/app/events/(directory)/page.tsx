import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import EventsBody from '@src/components/events/directory/EventsBody';
import { api } from '@src/trpc/server';
import {
  EventParamsSchema,
  eventParamsToFilters,
} from '@src/utils/eventFilter';
import { SnackbarPresets, SSRSnackbarWrapper } from '@src/utils/snackbar';

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
  const parsed = eventParamsToFilters.parse(searchParams);

  // Server-side query to avoid client-side fetching on load
  const results = await Promise.allSettled([
    api.event.findByFilters({ filters: parsed }),
    api.event.count({ includePast: true }),
  ]);

  const initialEvents =
    results[0].status === 'fulfilled' ? results[0].value : undefined;
  const count = results[1].status === 'fulfilled' ? results[1].value : 0;

  // If error fetching events with current filters, clear all filters and reload page
  if (
    results[0].status === 'rejected' &&
    Object.keys(searchParams).length > 0
  ) {
    redirect('/events');
  }

  // If error, show snackbar
  let errorReason: unknown;
  let disableSnackbar = true;
  for (const result of results) {
    if (result.status === 'rejected') {
      errorReason = result.reason;
      disableSnackbar = false;
      break;
    }
  }

  return (
    <SSRSnackbarWrapper
      disabled={disableSnackbar}
      snackbar={SnackbarPresets.errorCustomWithMessage(
        'An error occurred on the server',
        String(errorReason),
      )}
    >
      <EventsBody initialQueryData={initialEvents} total={count} />
    </SSRSnackbarWrapper>
  );
};

export default Events;
