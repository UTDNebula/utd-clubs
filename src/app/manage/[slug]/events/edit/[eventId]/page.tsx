import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

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
      <EventForm mode="edit" club={club} event={{ ...event, liked: false }} />
    </>
  );
};

export default EditEventPage;
