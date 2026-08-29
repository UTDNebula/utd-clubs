import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { auth } from '@/server/auth';
import EventCalendar from '@/systems/events/calendar/EventCalendar';

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

const CalendarPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return <EventCalendar />;
};

export default CalendarPage;
