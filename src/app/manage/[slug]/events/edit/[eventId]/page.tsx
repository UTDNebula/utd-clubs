import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import EventForm from '@/systems/events/EventForm';
import ManageHeader from '@/systems/manage/ManageHeader';
import { getGcalEventLink } from '@/common/modules/googleCalendar/googleCalendar';
import { auth } from '@/server/auth';
import { api } from '@/trpc/server';

const EditEventPage = async (props: {
  params: Promise<{ slug: string; eventId: string }>;
}) => {
  const { slug, eventId } = await props.params;

  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  const event = await api.event.byId({ id: eventId });
  if (!event) {
    return notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (event?.google) {
    redirect(
      getGcalEventLink(event.id, event.club.calendarId, session?.user.email),
    );
  }

  return (
    <>
      <ManageHeader
        club={club}
        path={[
          { text: 'Events', href: `/manage/${slug}/events` },
          { text: event.name, href: `/events/${eventId}` },
          { text: 'Edit', href: `/manage/${slug}/events/edit/${eventId}` },
        ]}
        hrefBack={`/manage/${slug}/events`}
      />
      <EventForm mode="edit" club={club} event={event} />
    </>
  );
};

export default EditEventPage;
