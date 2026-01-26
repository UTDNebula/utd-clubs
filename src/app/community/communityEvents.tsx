'use server';

import { TZDateMini } from '@date-fns/tz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from '@mui/material';
import Link from 'next/link';
import EventCard from '@src/components/events/EventCard';
import ManageEventsPagination from '@src/components/events/EventPagination';
import { api } from '@src/trpc/server';

export const RegisteredEvents = async () => {
  const events = await api.userMetadata.getEvents({
    currentTime: TZDateMini.tz('America/Chicago'),
    sortByDate: true,
  });

  if (events.length == 0) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="font-bold text-slate-500">
          You haven&apos;t registered for any events.
        </p>
        <Link href="/events">
          <Button
            variant="contained"
            className="normal-case"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Check Out Events
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export const ClubEvents = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const now = TZDateMini.tz('America/Chicago');
  const clubs = await api.club.getMemberClubs();
  const events = await api.userMetadata.getEventsFromJoinedClubs({
    currentTime: now,
    sortByDate: true,
    page,
    pageSize,
  });

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="font-bold text-slate-500">
          You haven&apos;t joined any clubs.
        </p>
        <Link href="/">
          <Button
            variant="contained"
            className="normal-case"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Check Out Clubs
          </Button>
        </Link>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="font-bold text-slate-500">
          Your joined clubs don&apos;t have any events.
        </p>
        <Link href="/events">
          <Button
            variant="contained"
            className="normal-case"
            size="large"
            endIcon={<ArrowForwardIcon />}
          >
            Check Out Events
          </Button>
        </Link>
      </div>
    );
  }

  const totalCount = await api.userMetadata.countEventsFromJoinedClubs({
    currentTime: now,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
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
};
