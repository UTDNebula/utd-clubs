'use client';

import Collapse from '@mui/material/Collapse';
import Pagination from '@mui/material/Pagination';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import EventDirectorySearchBar from '@src/components/searchBar/EventDirectorySearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import {
  eventFiltersSchema,
  listSelectedEventFilters,
} from '@src/utils/eventFilter';
import EventsFilterBar from './filter/EventsFilterBar';
import EventsFilterPanels from './filter/EventsFilterPanels';
import { setParams } from './filter/utils';
import EventDirectoryGrid from './filter/view/EventDirectoryGrid';
import ViewOptionsBar from './filter/ViewOptionsBar';

type EventsBodyProps = {
  initialQueryData?: RouterOutputs['event']['findByFilters'];
};

const EventsBody = ({ initialQueryData }: EventsBodyProps) => {
  const searchParams = useSearchParams();

  const filters = eventFiltersSchema.parse(Object.fromEntries(searchParams));
  const selectedFilters = listSelectedEventFilters(filters);

  const [showSidebar, setShowSidebar] = useState(true);

  const [queryData, setQueryData] = useState<
    RouterOutputs['event']['findByFilters'] | null
  >(null);

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
  };

  return (
    <section id="events-body" className="w-full flex items-start">
      <Collapse
        orientation="horizontal"
        in={showSidebar}
        className="max-md:hidden mt-4"
      >
        <div
          id="events-filters"
          className="flex flex-col gap-4 h-full w-76 mr-4"
        >
          <EventsFilterPanels backgroundHover filters={filters} />
        </div>
      </Collapse>
      <div id="events-content" className="flex flex-col gap-4 grow w-min">
        <div
          className="sticky z-40 bg-linear-to-b from-light dark:from-dark to-transparent from-75% py-4 -mb-4 max-sm:-mx-4 max-sm:px-4"
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
        <ViewOptionsBar filters={filters} pageCount={queryData?.pagination.totalPages} />
        <EventDirectoryGrid
          filters={filters}
          initialQueryData={initialQueryData}
          onQueryFetch={(data) => {
            setQueryData(data);
          }}
        />
        {queryData && queryData.pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              count={queryData.pagination.totalPages}
              page={filters.page}
              onChange={handleChangePage}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsBody;
