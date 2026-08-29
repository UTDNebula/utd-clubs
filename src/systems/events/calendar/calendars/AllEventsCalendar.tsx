'use client';

import { useQuery } from '@tanstack/react-query';
import EventCalendar from '../EventCalendar';
import { useTRPC } from '@/trpc/react';
import { useState } from 'react';
import { byDateRangeSchema } from '@/server/api/routers/event/inputSchemas';
import { z } from 'zod';
import { CalendarRange } from '@/lib/utils/calendarRange';

export default function AllEventsCalendar() {
  const api = useTRPC();

  const [range, setRange] = useState<z.infer<typeof byDateRangeSchema>>(() => ({
    startTime: new Date(),
    endTime: new Date(),
  }));

  const { data: events = [], isFetching } = useQuery(
    api.event.byDateRange.queryOptions(range, {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }),
  );

  const updateRange = (range: CalendarRange) => {
    setRange({
      startTime: new Date(range.startDate),
      endTime: new Date(range.endDate),
    });
  };

  return (
    <EventCalendar
      events={events}
      onMount={updateRange}
      onChange={updateRange}
      isFetching={isFetching}
    />
  );
}
