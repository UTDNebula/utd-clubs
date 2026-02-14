import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Panel from '@src/components/common/Panel';
import { EventSearchBar } from '@src/components/searchBar/EventSearchBar';
import { RouterOutputs } from '@src/trpc/shared';
import EventCard from '../EventCard';

type EventsBodyProps = {
  events: RouterOutputs['event']['findByDate']['events'];
};

const EventsBody = async ({ events }: EventsBodyProps) => {
  return (
    <section
      id="event-body"
      className="w-full rounded-lg grid grid-cols-1 md:grid-cols-[20rem_1fr] gap-4 items-start"
    >
      <div
        id="club-content-left"
        className="flex flex-col gap-4 h-full order-2 md:order-1"
      >
        <Panel
          heading="Filters"
          smallPadding
          enableCollapsing={{ toggleOnHeadingClick: true }}
          transparent="falseOnHover"
        >
          <ToggleButtonGroup
            size="small"
            className="[&>.MuiButtonBase-root]:normal-case [&>.MuiButtonBase-root]:grow"
            exclusive
            aria-label="Relevance"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="following">Your Clubs</ToggleButton>
            <ToggleButton value="discover">Discover</ToggleButton>
          </ToggleButtonGroup>
          <FormControlLabel
            label="Hide registered events"
            control={<Switch />}
          ></FormControlLabel>
        </Panel>
      </div>
      <div
        id="club-content-right"
        className="flex flex-col gap-4 order-1 md:order-2"
      >
        <EventSearchBar />
        <div className="flex flex-wrap w-full justify-evenly items-center pt-6 gap-4">
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
