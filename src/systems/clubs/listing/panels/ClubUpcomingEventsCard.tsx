'use client';

import Panel from '@nebula-library/components/Panel';
import { useState } from 'react';
import EventCard from '@/systems/events/EventCard';
import { RouterOutputs } from '@/trpc/shared';
import ClubEventsCalendar from '@/systems/events/calendar/calendars/ClubEventsCalendar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type ClubUpcomingEventsCardProps = {
  emptyText: string;
  heading: string;
  upcomingEvents: NonNullable<RouterOutputs['event']['byClubId']>; 
  clubId: string; // for events calendar view
  id?: string;
};

export default function ClubUpcomingEventsCard({
  emptyText, 
  heading,
  upcomingEvents,
  id,
  clubId, 
}: ClubUpcomingEventsCardProps) {

  const [view, setView] = useState<'calendar' | 'list'>('list');
  return (
    <>
      
      <Panel className="text-sm" id={id} smallPadding heading={heading}>
         <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView: 'list' | 'calendar' | null) => {
              if (newView) setView(newView); // null when clicking the active button, so ignore it
            }}
            size="small"
            aria-label="Event view"
            className="mt-3"
          >
            <ToggleButton value="list">Events</ToggleButton>
            <ToggleButton value="calendar">Calendar</ToggleButton>
          </ToggleButtonGroup>
        {view === 'list' ? ( // if view is list, show list view
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
        </div>) : ( // otherwise, do cal view 
          <div className="mt-5 w-full">
            <ClubEventsCalendar clubId={clubId} initialEvents={upcomingEvents} />
          </div>
        )}
      </Panel>
    </>
  );
}
