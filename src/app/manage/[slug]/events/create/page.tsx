import { notFound } from 'next/navigation';
import EventForm from '@src/components/events/EventForm';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

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
