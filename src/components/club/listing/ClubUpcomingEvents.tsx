import { TZDateMini } from '@date-fns/tz';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';
import { BaseCard } from '@src/components/common/BaseCard';

const ClubUpcomingEvents = async ({ clubId }: { clubId: string }) => {
  const now = TZDateMini.tz('America/Chicago');

  const data = await api.event.byClubId({
    clubId: clubId,
    currentTime: now,
    sortByDate: true,
  });

  return (
    <BaseCard className="w-full bg-slate-100 p-6 md:p-10">
      <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {data.length > 0 ? (
          data.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="text-md font-medium text-gray-700">
            There are no upcoming events.
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default ClubUpcomingEvents;
