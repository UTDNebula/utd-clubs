import { notFound } from 'next/navigation';
import AdminHeader from '@src/components/admin/AdminHeader';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

type Props = { params: Promise<{ slug: string }> };

export default async function Page(props: Props) {
  const params = await props.params;

  const club = await api.admin.getDirectoryInfo({ slug: params.slug });
  if (!club) {
    notFound();
  }

  const events = await api.event.byClubId({
    clubId: club.id,
    sortByDate: true,
  });

  return (
    <>
      <AdminHeader
        path={[
          { text: 'Admin', href: '/admin' },
          { text: 'Clubs', href: '/admin/clubs' },
          { text: club.name, href: `/admin/clubs/${club.slug}` },
          'Events',
        ]}
      />
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} view="admin" />
        ))}
      </div>
    </>
  );
}
