import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const { clubId } = await props.params;
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  return (
    <>
      <ManageHeader
        club={club}
        path={[
          { text: 'Events', href: `/manage/${club.id}/events` },
          { text: 'Create', href: `/manage/${club.id}/events/create` },
        ]}
        hrefBack={`/manage/${club.id}/events`}
      />
      <EventForm club={club} />
    </>
  );
};
export default Page;
