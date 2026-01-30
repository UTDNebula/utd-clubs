'use client';

import { Alert, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BaseCard } from '@src/components/common/BaseCard';
import { type RouterOutputs } from '@src/trpc/shared';
import ClientEventTime from './ClientEventTime';
import EventDeleteButton from './EventDeleteButton';
import EventRegisterButton, {
  EventRegisterButtonPreview,
  EventRegisterButtonSkeleton,
} from './EventRegisterButton';
import EventTimeAlert from './EventTimeAlert';

interface EventCardProps {
  event: RouterOutputs['event']['byClubId'][number];
  view?: 'normal' | 'manage' | 'preview' | 'admin';
}

const EventCard = ({ event, view = 'normal' }: EventCardProps) => {
  const src = event.image ?? event.club.profileImage;
  return (
    <BaseCard
      variant="interactive"
      className="flex h-104 w-64 flex-col overflow-hidden"
    >
      <Link
        href={`/events/${event.id}`}
        className="flex flex-1 min-h-0 flex-col"
      >
        <div className="relative h-40 shrink-0 w-full">
          <div className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-neutral-900" />
          {src && (
            <Image
              fill
              src={src}
              alt="event image"
              className="object-cover object-center"
            />
          )}
          <div className="absolute inset-0 p-2">
            <EventTimeAlert event={event} />
          </div>
        </div>
        <div className="flex flex-col p-5 space-y-2.5">
          <h3 className="line-clamp-2 text-xl font-medium">{event.name}</h3>
          {view !== 'manage' && view !== 'admin' && (
            <div className="line-clamp-2 text-base font-medium">
              {event.club.name}
            </div>
          )}
          <div className="text-royal dark:text-cornflower-300">
            <ClientEventTime
              startTime={event.startTime}
              endTime={event.endTime}
            />
          </div>
        </div>
      </Link>
      <div className="m-4 mt-auto flex shrink-0 flex-wrap gap-2">
        {view === 'normal' && (
          <EventRegisterButton
            clubId={event.club.id}
            clubSlug={event.club.slug}
            eventId={event.id}
          />
        )}
        {view === 'manage' &&
          (event.google ? (
            <Alert severity="info">Synced from Google Calendar.</Alert>
          ) : (
            <>
              <EventRegisterButton
                clubId={event.club.id}
                clubSlug={event.club.slug}
                eventId={event.id}
              />
              <EventDeleteButton event={event} />
            </>
          ))}
        {view === 'preview' && <EventRegisterButtonPreview />}
        {view === 'admin' &&
          (event.google ? (
            <Alert severity="info">Synced from Google Calendar.</Alert>
          ) : (
            <EventDeleteButton event={event} view="admin" />
          ))}
      </div>
    </BaseCard>
  );
};

export default EventCard;

interface EventCardSkeletonProps {
  manageView?: boolean;
}

export const EventCardSkeleton = ({ manageView }: EventCardSkeletonProps) => {
  return (
    <BaseCard
      variant="interactive"
      className="flex h-104 w-64 flex-col overflow-hidden"
    >
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="relative h-40 shrink-0 w-full">
          <Skeleton
            variant="rectangular"
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-neutral-800"
          />
        </div>
        <div className="flex flex-col p-5 space-y-2.5">
          <Skeleton variant="text" className="text-xl font-medium" />
          <Skeleton variant="text" className="text-base font-medium" />
          <Skeleton variant="text" className="text-base" />
        </div>
      </div>
      <div className="m-4 mt-auto flex shrink-0 flex-row gap-2">
        {!manageView && <EventRegisterButtonSkeleton />}
        {manageView && (
          <>
            <Skeleton
              variant="rounded"
              className="rounded-full"
              width={70}
              height={30.75}
            />
            <Skeleton
              variant="rounded"
              className="rounded-full"
              width={70}
              height={30.75}
            />
          </>
        )}
      </div>
    </BaseCard>
  );
};
