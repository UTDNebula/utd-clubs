import { TZDateMini } from '@date-fns/tz';
import { BaseCard } from '@src/components/common/BaseCard';
import EventCard from '@src/components/events/EventCard';
import { api } from '@src/trpc/server';

const ClubUpcomingEvents = async ({ clubId }: { clubId: string }) => {
  const now = TZDateMini.tz('America/Chicago');

  const data = await api.event.clubUpcoming({
    clubId,
    currentTime: now,
  });

  return (
    <BaseCard className="w-full p-6 md:p-10">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
        Upcoming Events
      </h2>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {data.length > 0 ? (
          data.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="text-md font-medium text-slate-600 dark:text-slate-400">
            There are no upcoming events.
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default ClubUpcomingEvents;
