'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { z } from 'zod';
import { CalendarRange } from '@/lib/utils/calendarRange';
import { findByDateRangeSchema } from '@/server/api/routers/event/inputSchemas';
import { useTRPC } from '@/trpc/react';
import EventCalendar from '../EventCalendar';

export default function AllEventsCalendar() {
  const api = useTRPC();

  const [range, setRange] = useState<z.infer<typeof findByDateRangeSchema>>(
    () => ({
      dateStart: new Date(),
      dateEnd: new Date(),
    }),
  );

  const { data: events = [], isFetching } = useQuery(
    api.event.findByDateRange.queryOptions(
      { includeUserEvents: true, ...range },
      {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    ),
  );

  const updateRange = (range: CalendarRange) => {
    setRange({
      dateStart: new Date(range.startDate),
      dateEnd: new Date(range.endDate),
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
