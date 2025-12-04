'use client';

import { useQuery } from '@tanstack/react-query';
import EventCard from '@src/components/events/EventCard';
import { useTRPC } from '@src/trpc/react';

const Events = (props: { clubId: string }) => {
  const api = useTRPC();
  const { data: events } = useQuery(
    api.event.byClubId.queryOptions({ clubId: props.clubId }),
  );
  return (
    <div
      className="group flex flex-wrap w-full justify-evenly items-center pt-4 gap-4"
      data-view="list"
    >
      {events?.map((event) => (
        <EventCard key={event.id} event={event} manageView />
      ))}
    </div>
  );
};

export default Events;
