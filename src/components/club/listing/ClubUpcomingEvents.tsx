import { type FC } from 'react';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

const ClubUpcomingEvents: FC<{ clubId: string }> = async ({ clubId }) => {
  const cur_time = new Date();

  const data = await api.event.byClubId({
    clubId: clubId,
    currentTime: cur_time,
    sortByDate: true,
  });

  return (
    <div className="w-full rounded-lg bg-slate-100 p-6 md:p-10">
      <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
      <div
        className="mt-4 md:mt-6 group flex flex-wrap w-full justify-evenly items-center gap-4"
        data-view="list"
      >
        {data.length > 0 ? (
          data.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="text-md font-medium text-gray-700">
            There are no upcoming events
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubUpcomingEvents;
