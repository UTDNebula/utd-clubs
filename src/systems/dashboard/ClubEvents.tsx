'use server';

import { TZDateMini } from '@date-fns/tz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotFollowingOrRegistered from '@/systems/dashboard/NotFollowingOrRegistered';
import EventCard from '@/systems/events/EventCard';
import SimplePagination from '@/common/components/SimplePagination';
import { LinkButton } from '@/common/components/LinkButton';
import { api } from '@/trpc/server';

export default async function ClubEvents({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const now = TZDateMini.tz('America/Chicago');
  const [clubs, events] = await Promise.all([
    api.user.clubs.getMemberClubs(),
    api.user.events.getEventsFromJoinedClubs({
      currentTime: now,
      sortByDate: true,
      page,
      pageSize,
    }),
  ]);

  if (clubs.length === 0) {
    return <NotFollowingOrRegistered type="clubs" />;
  }

  if (events.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center gap-4">
        <p className="font-bold text-slate-500 dark:text-slate-400">
          Your followed clubs don&apos;t have any events.
        </p>
        <LinkButton
          href="/events"
          variant="contained"
          className="normal-case"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          Check Out Events
        </LinkButton>
      </div>
    );
  }

  const totalCount = await api.user.events.countEventsFromJoinedClubs({
    currentTime: now,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-evenly gap-4 pt-10">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="flex justify-center py-10">
        <SimplePagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      </div>
    </>
  );
}
