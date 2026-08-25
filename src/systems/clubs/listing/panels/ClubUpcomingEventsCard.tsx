import Panel from '@nebula-library/components/Panel';
import EventCard from '@/systems/events/EventCard';
import { RouterOutputs } from '@/trpc/shared';

type ClubUpcomingEventsCardProps = {
  emptyText: string;
  heading: string;
  upcomingEvents: NonNullable<RouterOutputs['event']['byClubId']>;
  id?: string;
};

export default function ClubUpcomingEventsCard({
  emptyText,
  heading,
  upcomingEvents,
  id,
}: ClubUpcomingEventsCardProps) {
  return (
    <Panel className="text-sm" id={id} smallPadding heading={heading}>
      <div className="mt-5 flex w-full flex-nowrap items-center justify-start gap-4 overflow-x-auto px-4 pb-4 md:flex-wrap md:justify-evenly md:overflow-visible md:px-0 md:pb-0">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="shrink-0">
              <EventCard
                event={event}
                className="bg-white has-[.EventCardLink:focus]:bg-neutral-200 dark:bg-neutral-700 dark:has-[.EventCardLink:focus]:bg-neutral-600"
              />
            </div>
          ))
        ) : (
          <div className="text-md flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-12 font-medium text-slate-600 dark:border-slate-800 dark:text-slate-400">
            {emptyText}
          </div>
        )}
      </div>
    </Panel>
  );
}
