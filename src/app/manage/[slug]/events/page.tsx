import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EventCard from '@src/components/events/EventCard';
import ManageEventsPagination from '@src/components/events/EventPagination';
import ManageHeader from '@src/components/manage/ManageHeader';
import { api } from '@src/trpc/server';

type SearchParams = {
  page?: string;
  pageSize?: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};

  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 12;

  const club = await api.club.bySlug({ slug });
  if (!club) {
    notFound();
  }

  const events = await api.event.byClubId({
    clubId: club.id,
    sortByDate: true,
    page,
    pageSize,
  });

  const totalCount = await api.event.countByClubId({
    clubId: club.id,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <main>
      <ManageHeader
        club={club}
        path={[{ text: 'Events', href: `/manage/${slug}/events` }]}
        hrefBack={`/manage/${slug}/`}
      >
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Link href={`/manage/${slug}/events/create`}>
            <Button
              variant="contained"
              className="normal-case"
              startIcon={<AddIcon />}
              size="large"
            >
              Create Event
            </Button>
          </Link>
        </div>
      </ManageHeader>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} view="manage" />
        ))}
      </div>
      <div className="flex justify-center py-10">
        <ManageEventsPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
}
