import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import EventCalendar from '@src/components/community/EventCalendar';
import { auth } from '@src/server/auth';
import { signInRoute } from '@src/utils/redirect';

export default async function CalendarPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('events/calendar'));
  }

  return <EventCalendar />;
}
