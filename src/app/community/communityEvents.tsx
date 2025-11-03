'use server';

import Link from 'next/link';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

const CommunityEvents = async () => {
  const events = await api.userMetadata.getEvents();
  if (events.length == 0) {
    return (
      <div className="font-bold text-slate-500">
        <div>You haven&apos;t added any community events yet 😭</div>
        <div>
          You can check out new events{' '}
          <Link
            href={'/events'}
            className="text-royal text-lg transition-colors hover:text-blue-700"
          >
            here
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div
      className="group flex flex-wrap w-full justify-evenly items-center pt-10 gap-4"
      data-view="list"
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
export default CommunityEvents;
