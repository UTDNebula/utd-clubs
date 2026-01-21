import { TZDateMini } from '@date-fns/tz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import { Divider } from '@mui/material';
import {
  format,
  formatDuration,
  intervalToDuration,
  isSameDay,
  type FormatDistanceToken,
} from 'date-fns';
import EventRegisterButton from '@src/components/events/EventRegisterButton';
import { type RouterOutputs } from '@src/trpc/shared';

const distanceTokenUnits: Partial<Record<FormatDistanceToken, string>> = {
  xSeconds: 's',
  xMinutes: 'm',
  xHours: 'h',
  xDays: 'd',
  xMonths: 'mo',
  xYears: 'y',
};

const EventTitle = async ({
  event,
}: {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
}) => {
  const startTime = new TZDateMini(event.startTime, 'America/Chicago');
  const endTime = new TZDateMini(event.endTime, 'America/Chicago');

  return (
    <section
      id="event-title"
      className="w-full rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div className="flex flex-col gap-4 flex-grow min-w-0 overflow-hidden">
        {event.name && (
          <h1
            className={`font-display font-bold text-slate-800 dark:text-slate-200 ${
              event.name.length > 40
                ? 'text-xl md:text-3xl'
                : event.name.length > 12
                  ? 'text-2xl md:text-5xl'
                  : 'text-4xl md:text-5xl'
            }`}
          >
            {event.name}
          </h1>
        )}
        <div className="flex flex-wrap flex-col lg:flex-row gap-4 text-slate-600 dark:text-slate-400 lg:items-center text-sm md:text-base">
          <span className="flex gap-2 items-center">
            <EventIcon className="text-xl md:text-2xl" />
            {format(startTime, 'EEE, LLLL d, yyyy @ h:mm a')}
          </span>
          <Divider orientation="vertical" flexItem className="hidden lg:flex" />
          <span className="flex gap-2 items-center">
            <AccessTimeIcon className="text-xl md:text-2xl" />
            {startTime === endTime
              ? 'No end time specified'
              : `Lasts ${formatDuration(
                  intervalToDuration({
                    start: startTime,
                    end: endTime,
                  }),
                  {
                    locale: {
                      formatDistance: (token, count) =>
                        `${count}${distanceTokenUnits[token] ?? ''}`,
                    },
                  },
                )} (till ${isSameDay(startTime, endTime) ? format(endTime, 'h:mm a') : format(endTime, 'EEE, LLLL d, yyyy @ h:mm a')})`}
          </span>
          <Divider orientation="vertical" flexItem className="hidden lg:flex" />
          <span className="flex gap-2 items-center">
            <LocationPinIcon className="text-xl md:text-2xl" />
            {event.location}
          </span>
        </div>
      </div>
      <div className="w-full md:w-auto flex-shrink-0 flex md:ml-auto justify-end flex items-center gap-2">
        <EventRegisterButton
          isHeader
          clubId={event.club.id}
          clubSlug={event.club.slug}
          eventId={event.id}
        />
      </div>
    </section>
  );
};

export default EventTitle;
