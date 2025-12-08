import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ClubManageHeader from '@src/components/header/ClubManageHeader';
import { api } from '@src/trpc/server';

const Page = async (props: { params: Promise<{ clubId: string }> }) => {
  const { clubId } = await props.params;
  const club = await api.club.byId({ id: clubId });
  if (!club) {
    notFound();
  }

  return (
    <>
      <ClubManageHeader
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
