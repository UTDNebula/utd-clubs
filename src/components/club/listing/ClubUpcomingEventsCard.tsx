import { BaseCard } from '@src/components/common/BaseCard';
import EventCard from '@src/components/events/EventCard';
import { RouterOutputs } from '@src/trpc/shared';

type ClubUpcomingEventsCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
  upcomingEvents: NonNullable<RouterOutputs['event']['byClubId']>;
  oneYearAgo: Date;
  id?: string;
};

export default function ClubUpcomingEventsCard({
  club,
  upcomingEvents,
  oneYearAgo,
  id,
}: ClubUpcomingEventsCardProps) {
  return (
    <BaseCard className="flex flex-col bg-neutral-50 shadow-sm p-5" id={id}>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Upcoming Events</h2>
      <div className="flex flex-wrap w-full justify-evenly items-center gap-4 mt-5">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-md font-medium text-gray-700">
            {club.updatedAt == null || club.updatedAt < oneYearAgo
              ? 'No info about upcoming events'
              : 'There are no upcoming events'}
          </div>
        )}
      </div>
    </BaseCard>
  );
}
