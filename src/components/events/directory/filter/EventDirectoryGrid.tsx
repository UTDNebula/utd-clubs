'use client';

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import EventCard, { EventCardVariants } from '@src/components/events/EventCard';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import { useTRPC } from '@src/trpc/react';
import { RouterOutputs } from '@src/trpc/shared';
import { EventFiltersSchema } from '@src/utils/eventFilter';
import useDebounce from '@src/utils/useDebounce';
import useStable from '@src/utils/useStable';
import { useEventDirectoryStore } from './utils';

type EventDirectoryGridProps = {
  filters: EventFiltersSchema;
  initialQueryData?: RouterOutputs['event']['findByFilters'];
  /**
   * @default "card"
   */
  viewLayout?: EventCardVariants;
};

export default function EventDirectoryGrid({
  filters,
  initialQueryData,
  viewLayout = 'card',
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
  }, [api.event.findByFilters, debouncedFilters, queryClient]);

  const query = useQuery(
    api.event.findByFilters.queryOptions(
      { filters: debouncedFilters },
      {
        initialData: initialQueryData,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
      },
    ),
  );

  // On query success
  useEffect(() => {
    if (query.isSuccess && query.data) {
      const eventDirectoryStore = useEventDirectoryStore.getState();

      eventDirectoryStore.setSelectedCount(query.data.pagination.total);
      eventDirectoryStore.setFetchStatus(query.fetchStatus);
      eventDirectoryStore.setPageCount(query.data.pagination.totalPages);
    }
  }, [query.data, query.fetchStatus, query.isSuccess]);

  // On query error
  useEffect(() => {
    if (query.isError) {
      setSnackbar(
        SnackbarPresets.errorCustomMessage('Error!', query.error.message),
      );
    }
  }, [query.error?.message, query.isError]);

  const events = query.data?.data ?? initialQueryData?.data ?? [];

  return (
    <div>
      {events.length <= 0 && (
        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400">
          No events found
        </div>
      )}
      <div
        className={`${viewLayout === 'card' ? `grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))]` : viewLayout === 'list' ? 'flex flex-col max-sm:-mx-4' : ''} items-center max-sm:gap-2 gap-4 transition-opacity ${query.isFetching ? 'opacity-50 select-none pointer-events-none' : ''}`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {events.map((event) => (
            <motion.div
              // Adding viewLayout to key will remove the layout transition when viewLayout changes
              key={`${event.id} ${viewLayout}`}
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
              className="w-full"
              tabIndex={-1}
            >
              <EventCard event={event} variant={viewLayout} responsive />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
