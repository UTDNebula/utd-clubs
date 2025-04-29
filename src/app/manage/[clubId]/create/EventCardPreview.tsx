import EventTimeAlert from '@src/components/events/EventTimeAlert';
import { MoreIcon, PlusIcon } from '@src/icons/Icons';
import type { RouterOutputs } from '@src/trpc/shared';
import { format, isSameDay } from 'date-fns';
import Image from 'next/image';

interface Props {
  event: RouterOutputs['event']['findByFilters']['events'][number];
}

const EventCardPreview = ({ event }: Props) => {
  return (
    <div className="container flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
      <div className="relative">
        <div className="h-40 w-96">
          <Image
            src={'/event_default.jpg'}
            alt="event image"
            fill
            objectFit="cover"
          />
          <div className="absolute inset-0 p-2">
            <EventTimeAlert event={event} />
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col p-5">
        <div className="space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold">
            <p className="hover:text-blue-primary">{event.club.name}</p>
            <div>
              <span className="text-blue-primary">
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
        <div className="mt-auto flex flex-row space-x-4">
          <p className="bg-blue-primary h-10 w-10 rounded-full p-1.5 shadow-lg transition-colors hover:cursor-pointer hover:bg-blue-700 active:bg-blue-800">
            <MoreIcon fill="fill-white" />
          </p>
          <div className="h-10 w-10 rounded-full bg-white p-1.5 shadow-lg hover:cursor-pointer">
            <PlusIcon fill="fill-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventCardPreview;
