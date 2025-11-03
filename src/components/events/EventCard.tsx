'use server';

import Image from 'next/image';
import Link from 'next/link';
import { MoreIcon } from '@src/icons/Icons';
import { getServerAuthSession } from '@src/server/auth';
import { type RouterOutputs } from '@src/trpc/shared';
import ClientEventTime from './ClientEventTime'; //importing new component
import EventLikeButton from './EventLikeButton';
import EventTimeAlert from './EventTimeAlert';

type EventCardProps =
  | {
      event: RouterOutputs['event']['findByFilters']['events'][number];
      adminEvent?: false;
    }
  | {
      event: RouterOutputs['event']['byClubId'][number];
      adminEvent: true;
    };

const HorizontalCard = async ({ event, adminEvent }: EventCardProps) => {
  const session = await getServerAuthSession();
  return (
    <div className="container flex h-40 flex-row overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
      <div className="relative h-[160px] w-1/3 max-w-[225px]">
        <div className="h-[160px]">
          <Image
            fill
            src={'/event_default.jpg'}
            alt="event image"
            className="object-cover object-left"
          />
        </div>
        <div className="absolute inset-0 p-2 text-white">
          <EventTimeAlert event={event} />
        </div>
      </div>
      <div className="flex w-full flex-row px-6 py-5">
        <div className="flex flex-col space-y-2.5">
          <h3 className="font-bold">{event.name}</h3>
          <h4 className="text-xs font-bold whitespace-nowrap">
            {!adminEvent && (
              <>
                <Link
                  href={`/directory/${event.clubId ?? ''}`}
                  className="hover:text-blue-primary"
                  scroll
                >
                  {event.club.name}
                </Link>{' '}
                • <wbr />
              </>
            )}
            <span className="text-blue-primary">
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
        <div className="ml-auto flex flex-row space-x-4">
          {!adminEvent && session && (
            <EventLikeButton liked={event.liked} eventId={event.id} />
          )}
          <Link
            className="bg-blue-primary h-10 w-10 rounded-full p-1.5 shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800"
            href={`/event/${event.id}`}
            passHref
          >
            <MoreIcon fill="fill-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};
const VerticalCard = async ({ event, adminEvent }: EventCardProps) => {
  const session = await getServerAuthSession();
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
            {!adminEvent && (
              <Link
                href={`/directory/${event.clubId ?? ''}`}
                className="hover:text-blue-primary"
                scroll
              >
                {event.club.name}
              </Link>
            )}
            <div>
              <span className="text-blue-primary">
                <ClientEventTime
                  startTime={event.startTime}
                  endTime={event.endTime}
                />
              </span>
            </div>
          </h4>
        </div>
        <div className="mt-auto flex flex-row space-x-4">
          <Link
            className="bg-blue-primary h-10 w-10 rounded-full p-1.5 shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800"
            href={`/event/${event.id}`}
            passHref
          >
            <MoreIcon fill="fill-white" />
          </Link>
          {!adminEvent && session && (
            <EventLikeButton liked={event.liked} eventId={event.id} />
          )}
        </div>
      </div>
    </div>
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
