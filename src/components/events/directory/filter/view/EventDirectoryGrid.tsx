'use client';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import EventCard from '@src/components/events/EventCard';
import { useTRPC } from '@src/trpc/react';
import { RouterOutputs } from '@src/trpc/shared';
import { EventParamsSchemaOutput } from '@src/utils/eventFilter';
import useDebounce from '@src/utils/useDebounce';
import { useStable } from '@src/utils/useStable';
import { EventDirectoryStates } from '../utils';

type EventDirectoryGridProps = {
  filters: EventParamsSchemaOutput;
  initialQueryData?: RouterOutputs['event']['findByFilters'];
  onQueryFetch?: (states: EventDirectoryStates) => void;
};

export default function EventDirectoryGrid({
  filters,
  initialQueryData,
  onQueryFetch,
}: EventDirectoryGridProps) {
  const api = useTRPC();
  const queryClient = useQueryClient();

  const stabilizedFilters = useStable(filters);
  const debouncedFilters = useDebounce(stabilizedFilters, 300);

  // Refetch events if and only if filters change
  useEffect(() => {
    queryClient.invalidateQueries(
      api.event.findByFilters.queryOptions(
        { filters: debouncedFilters },
        { placeholderData: keepPreviousData },
      ),
    );
  }, [api.event.findByFilters, queryClient, debouncedFilters]);

  const query = useQuery(
    api.event.findByFilters.queryOptions(
      { filters: debouncedFilters },
      { initialData: initialQueryData, placeholderData: keepPreviousData },
    ),
  );

  // On query success
  useEffect(() => {
    if (query.data && query.isSuccess) {
      onQueryFetch?.({
        pending: query.isPending,
        pageCount: query.data.pagination.totalPages,
        fetchStatus: query.fetchStatus,
      });
    }
  }, [
    onQueryFetch,
    query.data,
    query.fetchStatus,
    query.isPending,
    query.isSuccess,
  ]);

  const events = query.data?.data ?? [];

  return (
    <div>
      <div
        className={`flex flex-wrap items-center gap-4 transition-opacity ${query.isFetching ? 'opacity-50 select-none pointer-events-none' : ''}`}
      >
        <AnimatePresence mode="popLayout">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  layout: { type: 'spring', stiffness: 120, damping: 20 },
                  opacity: { duration: 0.3 },
                }}
              >
                <EventCard key={event.id} event={event} />
              </motion.div>
            ))
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400">
              No events found
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
