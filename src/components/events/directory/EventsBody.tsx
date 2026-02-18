'use client';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import { EventSearchBar } from '@src/components/searchBar/EventSearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import EventCard from '../EventCard';
import EventsFilterBar from './filter/EventsFilterBar';
import EventsFilterPanels from './filter/EventsFilterPanels';
import ViewOptionsBar from './filter/ViewOptionsBar';

type EventsBodyProps = {
  events: RouterOutputs['event']['findByDate']['events'];
};

const EventsBody = ({ events }: EventsBodyProps) => {
  const [showSidebar, setShowSidebar] = useState(true);

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
          <EventsFilterPanels backgroundHover />
        </div>
      </Collapse>
      <div id="events-content" className="flex flex-col gap-4 grow w-min">
        <EventSearchBar />
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Chip
              icon={
                showSidebar ? (
                  <MenuOpenIcon fontSize="small" />
                ) : (
                  <MenuIcon fontSize="small" />
                )
              }
              variant="outlined"
              onClick={() => setShowSidebar((prev) => !prev)}
              className="border-[var(--mui-palette-divider)] max-md:hidden"
              slotProps={{
                root: { className: 'aspect-square [&>.MuiChip-icon]:m-0' },
                label: { className: 'p-0' },
              }}
            />
            <EventsFilterBar />
          </div>
        </div>
        <ViewOptionsBar />
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
