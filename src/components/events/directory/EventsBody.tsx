'use client';

import Collapse from '@mui/material/Collapse';
import Pagination from '@mui/material/Pagination';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import EventDirectorySearchBar from '@src/components/searchBar/EventDirectorySearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import {
  eventFiltersSchema,
  listSelectedEventFilters,
} from '@src/utils/eventFilter';
import useStable from '@src/utils/useStable';
import { EventCardVariants } from '../EventCard';
import EventsFilterBar from './filter/EventsFilterBar';
import EventsFilterPanels from './filter/EventsFilterPanels';
import { EventDirectoryStates, setParams } from './filter/utils';
import EventDirectoryGrid from './filter/view/EventDirectoryGrid';
import ViewOptionsBar from './filter/ViewOptionsBar';

type EventsBodyProps = {
  initialQueryData?: RouterOutputs['event']['findByFilters'];
};

const EventsBody = ({ initialQueryData }: EventsBodyProps) => {
  const searchParams = useSearchParams();

  // Use in place of `filters` for places where memoization isn't needed
  const unstableFilters = eventFiltersSchema.parse(
    Object.fromEntries(searchParams),
  );

  const filters = useStable(unstableFilters);
  const selectedFilters = useStable(listSelectedEventFilters(filters));

  const [showSidebar, setShowSidebar] = useState(true);

  const defaultViewLayout: EventCardVariants = (() => {
    let storageValue: EventCardVariants | null = null;
    if (typeof window !== 'undefined') {
      storageValue = window.localStorage.getItem(
        'EventDirectoryViewLayout',
      ) as EventCardVariants | null;
    }
    return storageValue ?? 'card';
  })();

  const [viewLayout, setViewLayout] =
    useState<EventCardVariants>(defaultViewLayout);

  const [eventDirectoryState, setEventDirectoryState] =
    useState<EventDirectoryStates>();

  const fetchStatus = eventDirectoryState?.fetchStatus;
  const pageCount = eventDirectoryState?.pageCount;

  // Toggle sidebar when pressing backslash key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ensures an editable input field is not selected
      if ((event.target as HTMLElement).matches(':read-write')) return;

      if (event.key === '\\') {
        setShowSidebar((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleChangeQuery = (value: string) => {
    setParams((params) => {
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
    });
  };

  const handleChangePage = (_: ChangeEvent<unknown>, newValue: number) => {
    setParams((params) => {
      if (newValue !== 0) {
        params.set('page', String(newValue));
      } else {
        params.delete('page');
      }
    });
    const eventsBody = document.getElementById('events-body');
    if (eventsBody) {
      eventsBody.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="events-body"
      className="w-full flex items-start"
      // TODO: The scrollMarginTop property should be BaseHeader's height. Replace this with a dynamic variable
      style={{ scrollMarginTop: 68 }}
    >
      <Collapse
        orientation="horizontal"
        in={showSidebar}
        className="max-md:hidden mt-4"
      >
        <div
          id="events-filters"
          className="flex flex-col gap-4 h-full w-76 mr-4"
        >
          <EventsFilterPanels backgroundHover filters={unstableFilters} />
        </div>
      </Collapse>
      <div id="events-content" className="flex flex-col gap-4 grow w-min">
        <div
          className="sticky z-40 bg-linear-to-b from-light dark:from-dark to-transparent from-75% py-4 -mb-4 max-sm:-mx-4 max-sm:px-4"
          // TODO: The top property should be BaseHeader's height. Replace this with a dynamic variable
          style={{ top: 68 }}
        >
          <EventDirectorySearchBar
            initialValue={unstableFilters.query}
            onChange={handleChangeQuery}
            loading={fetchStatus === 'fetching'}
          />
        </div>
        <EventsFilterBar
          filters={filters}
          selectedFilters={selectedFilters}
          showSidebar={showSidebar}
          onClickSidebar={setShowSidebar}
        />
        <ViewOptionsBar
          filters={filters}
          pageCount={pageCount}
          defaultViewValue={defaultViewLayout}
          onChangeView={(value) => {
            setViewLayout(value);
            window.localStorage.setItem('EventDirectoryViewLayout', value);
          }}
        />
        <EventDirectoryGrid
          filters={unstableFilters}
          initialQueryData={initialQueryData}
          onQueryFetch={useCallback((states: EventDirectoryStates) => {
            setEventDirectoryState(states);
          }, [])}
          viewLayout={viewLayout}
        />
        {pageCount && pageCount > 1 ? (
          <div className="flex justify-center">
            <Pagination
              count={pageCount}
              page={unstableFilters.page}
              onChange={handleChangePage}
            />
          </div>
        ) : undefined}
      </div>
    </section>
  );
};

export default EventsBody;
