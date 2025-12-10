'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type RouterOutputs } from '@src/trpc/shared';
import ClientEventTime from './ClientEventTime';
import EventDeleteButton from './EventDeleteButton';
import EventEditButton from './EventEditButton';
import EventRegisterButton from './EventRegisterButton';
import EventTimeAlert from './EventTimeAlert';

interface EventCardProps {
  event: RouterOutputs['event']['byClubId'][number];
  manageView?: boolean;
}

const EventCard = ({ event, manageView }: EventCardProps) => {
  const src = event.image ?? event.club.profileImage;
  return (
    <div className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
      <Link href={`/events/${event.id}`} className="grow flex flex-col">
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
            {!manageView && event.club.name}
            <div>
              <span className="text-royal">
                <ClientEventTime
                  startTime={event.startTime}
                  endTime={event.endTime}
                />
              </span>
            </div>
          </h4>
        </div>
      </Link>
      <div className="m-4 mt-0 flex flex-row gap-2">
        {!manageView && <EventRegisterButton eventId={event.id} />}
        {manageView && (
          <>
            <EventEditButton clubId={event.clubId} eventId={event.id} />
            <EventDeleteButton event={event} />
          </>
        )}
      </div>
    </div>
  );
};

export default EventCard;
