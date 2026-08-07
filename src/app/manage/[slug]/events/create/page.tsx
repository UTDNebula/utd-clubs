import { notFound } from 'next/navigation';
import EventForm from '@/systems/events/EventForm';
import ManageHeader from '@/systems/manage/ManageHeader';
import { api } from '@/trpc/server';

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  return (
    <>
      <ManageHeader
        club={club}
        path={[
          { text: 'Events', href: `/manage/${slug}/events` },
          { text: 'Create', href: `/manage/${slug}/events/create` },
        ]}
        hrefBack={`/manage/${slug}/events`}
      />
      <EventForm club={club} />
    </>
  );
};
export default Page;
