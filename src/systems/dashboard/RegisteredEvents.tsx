'use server';

import { TZDateMini } from '@date-fns/tz';
import NotFollowingOrRegistered from './NotFollowingOrRegistered';
import EventCard from '@/systems/events/EventCard';
import { api } from '@/trpc/server';

export default async function RegisteredEvents() {
  const events = await api.user.events.getEvents({
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
