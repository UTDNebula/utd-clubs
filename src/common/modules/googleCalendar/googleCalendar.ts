export function getGcalEventLink(
  eventId: string,
  calendarId: string | null,
  userEmail?: string,
) {
  return `https://calendar.google.com/calendar/r/event?eid=${btoa(`${eventId} ${calendarId ?? ''}`).replace(/=/g, '')}${userEmail && `&authuser=${userEmail}`}`;
}
