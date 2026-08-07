import AddIcon from '@mui/icons-material/Add';
import { notFound } from 'next/navigation';
import EventCard from '@src/systems/events/EventCard';
import EventsPagination from '@src/systems/events/EventPagination';
import IncludePastSwitch from '@src/systems/events/IncludePastSwitch';
import { LinkButton } from '@src/common/components/LinkButton';
import ManageHeader from '@src/systems/manage/ManageHeader';
import { api } from '@src/trpc/server';

type SearchParams = {
  page?: string;
  pageSize?: string;
  includePast?: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  const page = Number(sp?.page) || 1;
  const pageSize = Number(sp?.pageSize) || 12;
  const includePast = sp?.includePast === 'true';
  const now = new Date();

  const club = await api.club.bySlug({ slug });
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

  const totalCount = await api.event.count({
    clubId: club.id,
    includePast,
    includeAll: true,
    currentTime: now,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <main>
      <ManageHeader
        club={club}
        path={[{ text: 'Events', href: `/manage/${slug}/events` }]}
        hrefBack={`/manage/${slug}/`}
      >
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
          <LinkButton
            href={`/manage/${slug}/events/create`}
            variant="contained"
            className="normal-case"
            startIcon={<AddIcon />}
            size="large"
          >
            Create Event
          </LinkButton>
          <IncludePastSwitch checked={includePast} />
        </div>
      </ManageHeader>
      <div className="flex w-full flex-wrap items-center justify-evenly gap-4 pt-10">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} view="manage" />
        ))}
      </div>
      <div className="flex justify-center py-10">
        <EventsPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
}
