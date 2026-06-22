import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SnackbarType } from 'src/utils/snackbar/types';
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

const errorSearchParamKey = 'reloadBecauseFilterError';

type EventsSearchParams = EventParamsSchema & {
  [errorSearchParamKey]: boolean;
};

const Events = async (props: { searchParams: Promise<EventsSearchParams> }) => {
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
    Object.keys(searchParams).length >
      // Exclude errorSearchParamKey from length check (prevents 307 status code loop)
      (searchParams[errorSearchParamKey] ? 1 : 0)
  ) {
    redirect(`/events?${errorSearchParamKey}=true`);
  }

  let disableSnackbar = true;
  let snackbar: SnackbarType = { message: "You shouldn't see this..." };

  // If error, show snackbar with error
  for (const result of results) {
    if (result.status === 'rejected') {
      disableSnackbar = false;
      snackbar = SnackbarPresets.errorCustomWithMessage(
        'An error occurred on the server',
        String(result.reason),
      );
      break;
    }
  }

  // If clearing the filters fixed the error, inform user through snackbar
  if (disableSnackbar && searchParams[errorSearchParamKey]) {
    disableSnackbar = false;
    snackbar = {
      message:
        'Your filters were cleared because they caused an error on the server',
      type: 'warning',
      closeOn: { dismiss: true },
    };
  }

  return (
    <SSRSnackbarWrapper
      disabled={disableSnackbar}
      snackbar={snackbar}
      deleteSearchParamKey={errorSearchParamKey}
    >
      <EventsBody initialQueryData={initialEvents} total={count} />
    </SSRSnackbarWrapper>
  );
};

export default Events;
