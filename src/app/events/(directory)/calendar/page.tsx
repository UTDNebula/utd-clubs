import Skeleton from '@mui/material/Skeleton';
import { Metadata } from 'next';
import { Suspense } from 'react';
import AllEventsCalendar from '@/systems/events/calendar/calendars/AllEventsCalendar';

export const metadata: Metadata = {
  title: 'Events Calendar',
  description: 'The calendar with every event at UTD.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/events/calendar',
  },
  openGraph: {
    url: 'https://clubs.utdnebula.com/events/calendar',
    description: 'The calendar with every event at UTD.',
  },
};

export default async function CalendarPage() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={512} />}>
      <AllEventsCalendar />
    </Suspense>
  );
}
