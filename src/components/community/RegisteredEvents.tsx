'use server';

import { TZDateMini } from '@date-fns/tz';
import NotFollowingOrRegistered from '@src/components/community/NotFollowingOrRegistered';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

export default async function RegisteredEvents() {
  const events = await api.userMetadata.getEvents({
    currentTime: TZDateMini.tz('America/Chicago'),
    sortByDate: true,
  });

  if (events.length == 0) {
    return <NotFollowingOrRegistered type="events" />;
  }
  return (
    <div className="flex w-full flex-wrap items-center justify-evenly gap-4 pt-10">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
