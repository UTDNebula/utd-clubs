'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CalendarRange } from '@/lib/utils/calendarRange';
import { useTRPC } from '@/trpc/react';
import EventCalendar from '../EventCalendar';

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
