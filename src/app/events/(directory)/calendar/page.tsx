import { Metadata } from 'next';
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
  return <AllEventsCalendar />;
}
