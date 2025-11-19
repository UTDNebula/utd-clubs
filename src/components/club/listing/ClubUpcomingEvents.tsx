import Link from 'next/link';
import { type FC } from 'react';
import { api } from '@src/trpc/server';

const MAX_DESCRIPTION_LENGTH = 150;

const ClubUpcomingEvents: FC<{ clubId: string }> = async ({ clubId }) => {
  const cur_time = new Date();

  const data = await api.event.byClubId({
    clubId: clubId,
    currentTime: cur_time,
    sortByDate: true,
  });

  return (
    <div className="w-full rounded-lg bg-slate-100 p-6 md:p-10">
      <h1 className="text-2xl font-semibold text-gray-800">Upcoming Events</h1>
      <div className="mt-4 flex flex-col space-y-4 md:mt-6 md:flex-row md:space-y-0 md:space-x-4">
        {data.length > 0 ? (
          data.map((event) => (
            <Link
              key={event.id}
              className="w-60 cursor-pointer rounded-lg bg-blue-500 p-4 transition-colors duration-300 hover:bg-blue-600"
              href={`/event/${event.id}`}
            >
              <h2 className="text-lg font-medium text-white">{event.name}</h2>
              <p className="mt-2 text-sm text-blue-100">
                {event.description.length > MAX_DESCRIPTION_LENGTH
                  ? `${event.description.substring(
                      0,
                      MAX_DESCRIPTION_LENGTH,
                    )}...`
                  : event.description}
              </p>
              <p className="mt-2 text-xs font-light text-blue-200">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(event.startTime))}
              </p>
            </Link>
          ))
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
