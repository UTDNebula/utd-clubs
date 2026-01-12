import Panel from '@src/components/common/Panel';
import EventCard from '@src/components/events/EventCard';
import { RouterOutputs } from '@src/trpc/shared';

type ClubUpcomingEventsCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
  upcomingEvents: NonNullable<RouterOutputs['event']['byClubId']>;
  id?: string;
};

export default function ClubUpcomingEventsCard({
  club,
  upcomingEvents,
  id,
}: ClubUpcomingEventsCardProps) {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return (
    <Panel className="text-sm" id={id} smallPadding heading="Upcoming Events">
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
    </Panel>
  );
}
