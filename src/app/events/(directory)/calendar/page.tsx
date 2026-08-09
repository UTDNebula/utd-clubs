import { Alert } from '@mui/material';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import EventCalendar from '@/systems/events/calendar/EventCalendar';
import { auth } from '@/server/auth';
import { signInRoute } from '@/lib/utils/redirect';

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
