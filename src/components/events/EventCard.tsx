'use server';

import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@src/server/auth';
import { type RouterOutputs } from '@src/trpc/shared';
import ClientEventTime from './ClientEventTime'; //importing new component

import EventDeleteButton from './EventDeleteButton';
import EventEditButton from './EventEditButton';
import EventRegisterButton from './EventRegisterButton';
import EventTimeAlert from './EventTimeAlert';

interface EventCardProps {
  event: RouterOutputs['event']['byClubId'][number];
  manageView?: boolean;
}

const HorizontalCard = async ({ event, manageView }: EventCardProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const src = event.image ?? event.club.profileImage;
  return (
    <Link
      href={`/event/${event.id}`}
      className="flex h-40 w-full flex-row overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg"
    >
      <div className="relative h-[160px] w-1/3 max-w-[225px]">
        <div className="absolute inset-0 h-full w-full bg-gray-200" />
        {src && (
          <Image
            fill
            src={src}
            alt="event image"
            className="object-cover object-left"
          />
        )}
        <div className="absolute inset-0 p-2 text-white">
          <EventTimeAlert event={event} />
        </div>
      </div>
      <div className="flex w-full flex-row px-6 py-5">
        <div className="flex flex-col space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold whitespace-nowrap">
            {!manageView && (
              <>
                {event.club.name} • <wbr />
              </>
            )}
            <span className="text-royal">
              <ClientEventTime
                startTime={event.startTime} //ClientEventTime logic
                endTime={event.endTime}
              />
            </span>
          </h4>

          <p className="line-clamp-3 overflow-clip text-xs font-bold text-ellipsis">
            {event.description}
          </p>
        </div>
        <div className="ml-auto flex flex-row gap-2 h-fit self-center">
          {!manageView && session && <EventRegisterButton eventId={event.id} />}
          {manageView && (
            <>
              <EventEditButton clubId={event.clubId} eventId={event.id} />
              <EventDeleteButton event={event} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
const VerticalCard = async ({ event, manageView }: EventCardProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const src = event.image ?? event.club.profileImage;
  return (
    <Link
      href={`/event/${event.id}`}
      className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg"
    >
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
        <div className="mt-auto flex flex-row gap-2">
          {!manageView && session && <EventRegisterButton eventId={event.id} />}
          {manageView && (
            <>
              <EventEditButton clubId={event.clubId} eventId={event.id} />
              <EventDeleteButton event={event} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

const EventCard = (props: EventCardProps) => {
  return (
    <>
      <div className="hidden lg:group-data-[view=list]:contents">
        <HorizontalCard {...props} />
      </div>
      <div className="contents lg:group-data-[view=list]:hidden">
        <VerticalCard {...props} />
      </div>
    </>
  );
};
export default EventCard;
