'use client';

import { useQuery } from '@tanstack/react-query';
import EventCalendar from '../EventCalendar';
import { useTRPC } from '@/trpc/react';
import { CalendarRange } from '@/lib/utils/calendarRange';
import { useState } from 'react';

export default function RegisteredEventsCalendar() {
  const api = useTRPC();

  const [range, setRange] = useState<CalendarRange>(() => ({
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  }));

  const { data: events = [], isFetching } = useQuery(
    api.user.events.getRegisteredEventsByRange.queryOptions(range, {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }),
  );

  return (
    <EventCalendar
      events={events}
      onMount={setRange}
      onChange={setRange}
      isFetching={isFetching}
    />
  );
}
