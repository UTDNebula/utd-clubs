'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import EventCard from '@src/components/events/EventCard';
import { useTRPC } from '@src/trpc/react';
import { RouterOutputs } from '@src/trpc/shared';
import { EventParamsSchemaOutput } from '@src/utils/eventFilter';
import useDebounce from '@src/utils/useDebounce';
import { useStable } from '@src/utils/useStable';

type EventDirectoryGridProps = {
  filters: EventParamsSchemaOutput;
  initialQueryData?: RouterOutputs['event']['findByFilters'];
  onQueryFetch?: (data: RouterOutputs['event']['findByFilters']) => void;
};

export default function EventDirectoryGrid({
  filters,
  initialQueryData,
  onQueryFetch,
}: EventDirectoryGridProps) {
  const api = useTRPC();
  const queryClient = useQueryClient();

  const debouncedFilters = useDebounce(filters, 300);
  const stabilizedFilters = useStable(debouncedFilters);

  // Refetch events if and only if filters change
  useEffect(() => {
    queryClient.invalidateQueries(
      api.event.findByFilters.queryOptions({ filters: stabilizedFilters }),
    );
  }, [api.event.findByFilters, queryClient, stabilizedFilters]);

  const query = useQuery(
    api.event.findByFilters.queryOptions(
      { filters: stabilizedFilters },
      { initialData: initialQueryData },
    ),
  );

  // On query success
  useEffect(() => {
    if (query.data && query.isSuccess) {
      onQueryFetch?.(query.data);
    }
  }, [onQueryFetch, query.data, query.isSuccess]);

  const events = query.data?.data ?? [];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400">
          No events found
        </div>
      )}
    </div>
  );
}
