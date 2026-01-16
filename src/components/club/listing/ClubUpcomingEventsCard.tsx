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
      <div
        className="flex w-full gap-4 mt-5 items-center 
          flex-nowrap justify-start overflow-x-auto pb-4 px-4
          md:flex-wrap md:justify-evenly md:overflow-visible md:pb-0 md:px-0"
      >
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="shrink-0">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-md font-medium text-slate-600 dark:text-slate-400">
            {club.updatedAt == null || club.updatedAt < oneYearAgo
              ? 'No info about upcoming events'
              : 'There are no upcoming events'}
          </div>
        )}
      </div>
    </Panel>
  );
}
