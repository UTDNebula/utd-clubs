import { Alert } from '@mui/material';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { signInRoute } from '@/lib/utils/redirect';
import { auth } from '@/server/auth';
import EventCalendar from '@/systems/events/calendar/EventCalendar';

export default async function CalendarPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(await signInRoute('events/calendar'));
  }

  return (
    <>
      <Alert severity="info" className="mt-4">
        This calendar only shows events you have registered for. This will be
        resolved in the future.
      </Alert>
      <EventCalendar />
    </>
  );
}
