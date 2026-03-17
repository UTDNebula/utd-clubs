'use client';

import Collapse from '@mui/material/Collapse';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EventSearchBar } from '@src/components/searchBar/EventSearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import {
  eventFiltersSchema,
  listSelectedEventFilters,
} from '@src/utils/eventFilter';
import EventCard from '../EventCard';
import EventsFilterBar from './filter/EventsFilterBar';
import EventsFilterPanels from './filter/EventsFilterPanels';
import ViewOptionsBar from './filter/ViewOptionsBar';

type EventsBodyProps = {
  events: RouterOutputs['event']['findByDate']['events'];
};

const EventsBody = ({ events }: EventsBodyProps) => {
  const searchParams = useSearchParams();

  // console.log('from entries search params', Object.fromEntries(searchParams));

  const filters = eventFiltersSchema.parse(Object.fromEntries(searchParams));

  // console.log('FILTERS', filters);
  const selectedFilters = listSelectedEventFilters(filters);
  // console.log('selectedFilters', selectedFilters);

  const [showSidebar, setShowSidebar] = useState(true);

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

  return (
    <section id="events-body" className="w-full flex items-start">
      <Collapse
        orientation="horizontal"
        in={showSidebar}
        className="max-md:hidden"
      >
        <div
          id="events-filters"
          className="flex flex-col gap-4 h-full w-76 mr-4"
        >
          <EventsFilterPanels backgroundHover filters={filters} />
        </div>
      </Collapse>
      <div id="events-content" className="flex flex-col gap-4 grow w-min">
        <EventSearchBar />
        <EventsFilterBar
          filters={filters}
          selectedFilters={selectedFilters}
          showSidebar={showSidebar}
          onClickSidebar={setShowSidebar}
        />
        <ViewOptionsBar filters={filters} />
        <div className="flex flex-wrap items-center gap-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-base font-medium text-slate-600 dark:text-slate-400">
              No events found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsBody;
