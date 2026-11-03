import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getGcalEventLink } from '@/lib/modules/googleCalendar/getGcalEventLink';
import { auth } from '@/server/auth';
import EventForm from '@/systems/events/create/EventForm';
import ManageHeader from '@/systems/manage/ManageHeader';
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

  const canEdit = await api.event.manage.canEdit({
    eventId,
    clubId: club.id,
  });
  if (!canEdit) {
    return notFound();
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (event.google && event.clubId !== club.id) {
    return notFound();
  }
  if (event.google) {
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
          { text: 'Edit', href: `/manage/${slug}/event/${eventId}` },
        ]}
        hrefBack={`/manage/${slug}/events`}
      />
      {event.clubId !== club.id && (
        <div
          role="status"
          className="border-cornflower-300 bg-cornflower-50 text-haiti dark:border-cornflower-700 dark:bg-haiti/60 mb-6 rounded-lg border px-4 py-3 text-sm dark:text-white"
        >
          <span className="font-semibold">Co-hosted event.</span> You are
          editing this event on behalf of {club.name}. It is owned by{' '}
          {event.club.name}; only the owning club can delete it or manage its
          co-hosts.
        </div>
      )}
      <EventForm mode="edit" club={club} event={event} />
    </>
  );
};

export default EditEventPage;
