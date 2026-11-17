import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getGcalEventLink } from '@/lib/modules/googleCalendar/getGcalEventLink';
import { auth } from '@/server/auth';
import Details from '@/systems/manage/events/forms/Details';
import { api } from '@/trpc/server';

const EditEventPage = async (props: {
  params: Promise<{ slug: string; eventId: string }>;
}) => {
  const { slug, eventId } = await props.params;

  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  const event = await api.event.byId({ eventId });
  if (!event) {
    return notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (event?.google) {
    redirect(
      getGcalEventLink(event.id, event.club.calendarId, session?.user.email),
    );
  }

  // The header is rendered by layout.tsx
  return <Details mode="edit" club={club} event={event} />;
};

export default EditEventPage;
