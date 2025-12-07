import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import { format, isSameDay } from 'date-fns';
import Image from 'next/image';
import EventTimeAlert from '@src/components/events/EventTimeAlert';
import type { RouterOutputs } from '@src/trpc/shared';

interface Props {
  event: RouterOutputs['event']['findByFilters']['events'][number];
}

const EventCardPreview = ({ event }: Props) => {
  const src = event.image ?? event.club.profileImage;
  return (
    <div className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
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
      <div className="flex h-full flex-col p-5">
        <div className="space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold">
            {event.club.name}
            <div>
              <span className="text-royal">
                {format(event.startTime, 'E, MMM d, p')}
                {isSameDay(event.startTime, event.endTime) ? (
                  <> - {format(event.endTime, 'p')}</>
                ) : (
                  <>
                    {' '}
                    - <br />
                    {format(event.endTime, 'E, MMM d, p')}
                  </>
                )}
              </span>
            </div>
          </h4>
        </div>
        <div className="mt-auto">
          <IconButton className="bg-royal [&>svg]:fill-white">
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
export default EventCardPreview;
