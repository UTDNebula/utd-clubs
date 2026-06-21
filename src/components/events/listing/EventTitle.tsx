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
      className="flex w-full flex-col items-start justify-between gap-4 rounded-lg md:flex-row md:items-center"
    >
      <div className="flex min-w-0 flex-grow flex-col gap-4 overflow-hidden">
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
        <div className="flex flex-col flex-wrap gap-4 text-sm text-slate-600 md:text-base lg:flex-row lg:items-center dark:text-slate-400">
          <span className="flex items-center gap-2">
            <EventIcon className="text-xl md:text-2xl" />
            {format(startTime, 'EEE, LLLL d, yyyy @ h:mm a')}
          </span>
          <Divider orientation="vertical" flexItem className="hidden lg:flex" />
          <span className="flex items-center gap-2">
            <AccessTimeIcon className="text-xl md:text-2xl" />
            {startTime.getTime() === endTime.getTime()
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
          <span className="flex items-center gap-2">
            <LocationPinIcon className="text-xl md:text-2xl" />
            {event.location || <i>No Location</i>}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-shrink-0 items-center justify-end gap-2 md:ml-auto md:w-auto">
        <EventRegisterButton
          isHeader
          clubId={event.club.id}
          clubSlug={event.club.slug}
          eventId={event.id}
          calendarId={event.club.calendarId}
          fromGoogle={event.google}
        />
      </div>
    </section>
  );
};

export default EventTitle;
