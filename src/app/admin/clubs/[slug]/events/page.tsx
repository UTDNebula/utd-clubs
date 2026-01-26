import { notFound } from 'next/navigation';
import AdminHeader from '@src/components/admin/AdminHeader';
import EventCard from '@src/components/events/EventCard';
import ManageEventsPagination from '@src/components/events/EventPagination';
import IncludePastSwitch from '@src/components/events/IncludePastSwitch';
import { api } from '@src/trpc/server';

type Props = {
  params: { slug: string };
  searchParams?: { page?: string; pageSize?: string; includePast?: string };
};

export default async function Page({ params, searchParams }: Props) {
  const sp = searchParams ?? {};

  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 12;
  const includePast = sp.includePast === '1';
  const now = new Date();

  const club = await api.admin.getDirectoryInfo({ slug: params.slug });
  if (!club) {
    notFound();
  }

  const events = await api.event.byClubId({
    clubId: club.id,
    sortByDate: true,
    page,
    pageSize,
    includePast,
    currentTime: now,
  });

  const totalCount = await api.event.countByClubId({
    clubId: club.id,
    includePast,
    currentTime: now,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <AdminHeader
        path={[
          { text: 'Admin', href: '/admin' },
          { text: 'Clubs', href: '/admin/clubs' },
          { text: club.name, href: `/admin/clubs/${club.slug}` },
          'Events',
        ]}
      >
        <IncludePastSwitch checked={includePast} />
      </AdminHeader>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} view="admin" />
        ))}
      </div>
      <div className="flex justify-center py-10">
        <ManageEventsPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </>
  );
}
