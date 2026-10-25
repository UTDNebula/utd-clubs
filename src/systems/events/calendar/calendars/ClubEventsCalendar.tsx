'use client';
import { useQuery } from '@tanstack/react-query';
import { type RouterOutputs } from '@/trpc/shared';
import { useTRPC } from '@/trpc/react';
import EventCalendar from '../EventCalendar';

type ClubEvents = RouterOutputs['event']['byClubId']; 

type ClubEventsCalendarProps = {
    clubId: string; // parameter for club ID -- which club 
    initialEvents?: ClubEvents; // parameter for initial events -- can be zero or more events, prop for parent 
    };

export default function ClubEventsCalendar(props: ClubEventsCalendarProps) {
    const api = useTRPC();
 const { data: events = [], isFetching } = useQuery(
    api.event.byClubId.queryOptions( // sent to backend to get events for a specific club
      { clubId: props.clubId }, // clubid is passed to the backend to get events for that specific club
      {
        initialData: props.initialEvents, // initial events 
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    ),
  );

  
    return (
        <div className="[&_.use-sticky-schedule-header]:[--sticky-schedule-header-padding:0px]">
            <EventCalendar events={events} isFetching={isFetching}/> 
        </div>
        
    );

}

