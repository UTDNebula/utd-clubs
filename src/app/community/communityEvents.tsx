'use server';

import Link from 'next/link';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

const CommunityEvents = async () => {
  const events = await api.userMetadata.getEvents();
  if (events.length == 0) {
    return (
      <div className="font-bold text-slate-500">
        <p className="mt-2">You haven&apos;t added any community events yet.</p>
        <p className="mt-2">
          You can check out new events{' '}
          <Link
            href="/events"
            className="text-royal hover:text-royalDark underline decoration-transparent hover:decoration-inherit transition"
          >
            here
          </Link>
          .
        </p>
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
export default CommunityEvents;
