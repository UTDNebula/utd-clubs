'use client';

import Collapse from '@mui/material/Collapse';
import Pagination from '@mui/material/Pagination';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import EventDirectorySearchBar from '@src/components/searchBar/EventDirectorySearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import {
  eventParamsToFilters,
  listSelectedEventFilters,
} from '@src/utils/eventFilter';
import useStable from '@src/utils/useStable';
import { EventCardVariants } from '../EventCard';
import EventDirectoryGrid from './filter/EventDirectoryGrid';
import EventsFilterBar from './filter/EventsFilterBar';
import EventsFilterPanels from './filter/EventsFilterPanels';
import EventsViewOptionsBar from './filter/EventsViewOptionsBar';
import { setEventsParams, useEventDirectoryStore } from './filter/utils';

type EventsBodyProps = {
  initialQueryData?: RouterOutputs['event']['findByFilters'];
  total?: number;
};

const EventsBody = ({ initialQueryData, total }: EventsBodyProps) => {
  useEffect(() => {
    useEventDirectoryStore.getState().setTotalCount(total);
  }, [total]);

  const searchParams = useSearchParams();

  const filters = eventParamsToFilters.parse(Object.fromEntries(searchParams));
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

  const pageCount = useEventDirectoryStore((state) => state.pageCount);

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
    setEventsParams((params) => {
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
    });
  };

  const handleChangePage = (_: ChangeEvent<unknown>, newValue: number) => {
    setEventsParams((params) => {
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
      className="flex w-full items-start"
      // TODO: The scrollMarginTop property should be BaseHeader's height. Replace this with a dynamic variable
      style={{ scrollMarginTop: 68 }}
    >
      <Collapse
        orientation="horizontal"
        in={showSidebar}
        className="mt-4 max-md:hidden"
      >
        <div
          id="events-filters"
          className="mr-4 flex h-full w-76 flex-col gap-4"
        >
          <EventsFilterPanels backgroundHover filters={filters} />
        </div>
      </Collapse>
      <div id="events-content" className="flex w-min grow flex-col gap-4">
        <div
          className="from-light dark:from-dark sticky z-40 -mx-4 -mb-4 bg-linear-to-b from-75% to-transparent px-4 py-4"
          // TODO: The top property should be BaseHeader's height. Replace this with a dynamic variable
          style={{ top: 68 }}
        >
          <EventDirectorySearchBar
            initialValue={filters.query}
            onChange={handleChangeQuery}
          />
        </div>
        <EventsFilterBar
          filters={filters}
          selectedFilters={selectedFilters}
          showSidebar={showSidebar}
          onClickSidebar={setShowSidebar}
        />
        <EventsViewOptionsBar
          filters={filters}
          pageCount={pageCount}
          defaultViewValue={defaultViewLayout}
          onChangeView={(value) => {
            setViewLayout(value);
            window.localStorage.setItem('EventDirectoryViewLayout', value);
          }}
        />
        <EventDirectoryGrid
          filters={filters}
          initialQueryData={initialQueryData}
          viewLayout={viewLayout}
        />
        {pageCount && pageCount > 1 ? (
          <div className="flex justify-center">
            <Pagination
              count={pageCount}
              page={filters.page}
              onChange={handleChangePage}
            />
          </div>
        ) : undefined}
      </div>
    </section>
  );
};

export default EventsBody;
