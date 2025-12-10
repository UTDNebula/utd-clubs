import { TZDateMini } from '@date-fns/tz';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { format, isSameDay, isSameYear } from 'date-fns';
import Image from 'next/image';
import EventTimeAlert from '@src/components/events/EventTimeAlert';
import type { SelectClub, SelectEvent } from '@src/server/db/models';

interface Props {
  club: SelectClub;
  event: SelectEvent;
}

const EventCardPreview = ({ club, event }: Props) => {
  const src = event.image ?? club.profileImage;
  const tzStartTime = new TZDateMini(event.startTime, 'America/Chicago');
  const tzEndTime = new TZDateMini(event.endTime, 'America/Chicago');

  return (
    <div className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
      <div className="grow flex flex-col">
        <div className="relative h-40 shrink-0 w-full">
          <div className="absolute inset-0 h-full w-full bg-gray-200" />
          {src && (
            <Image
              fill
              src={src}
              alt="event image"
              className="object-cover object-left"
            />
          )}
          <div className="absolute inset-0 p-2">
            <EventTimeAlert event={event} />
          </div>
        </div>
        <div className="flex h-full flex-col p-5 space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold">
            {club.name}
            <div>
              <span className="text-royal">
                {isSameYear(tzStartTime, TZDateMini.tz('America/Chicago'))
                  ? null
                  : format(tzStartTime, 'yyyy ')}
                {format(tzStartTime, 'E, MMM d, p')}
                {isSameDay(tzStartTime, tzEndTime) ? (
                  <> - {format(tzEndTime, 'p')}</>
                ) : (
                  <>
                    {' '}
                    - <br />
                    {format(tzEndTime, 'E, MMM d, p')}
                  </>
                )}
              </span>
            </div>
          </h4>
        </div>
      </div>
      <div className="m-4 mt-0 flex flex-row gap-2">
        <Button
          variant="contained"
          className="normal-case"
          size="small"
          startIcon={<AddIcon />}
        >
          Register
        </Button>
      </div>
    </div>
  );
};
export default EventCardPreview;
