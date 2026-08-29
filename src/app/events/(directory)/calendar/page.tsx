import { Alert } from '@mui/material';
import AllEventsCalendar from '@/systems/events/calendar/calendars/AllEventsCalendar';

export default async function CalendarPage() {
  return (
    <>
      <Alert severity="info" className="mt-4">
        This calendar only shows events you have registered for. This will be
        resolved in the future.
      </Alert>
      <AllEventsCalendar />
    </>
  );
}
