import type { Metadata } from 'next';
import EventCalendar from '@/systems/dashboard/EventCalendar';

export const metadata: Metadata = {
  title: 'My Event Calendar | My Community',
  description: 'View all your registered events in a calendar.',
  alternates: {
    canonical: 'https://clubs.utdnebula.com/community/calendar',
  },
  openGraph: {
    title: 'My Event Calendar | My Community',
    url: 'https://clubs.utdnebula.com/community/calendar',
    description: 'View all your registered events in a calendar.',
  },
};

const CalendarPage = () => {
  return <EventCalendar />;
};

export default CalendarPage;
