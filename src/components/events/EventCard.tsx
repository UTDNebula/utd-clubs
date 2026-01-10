'use client';

import { Alert, Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { BaseCard } from '@src/components/common/BaseCard';
import { type RouterOutputs } from '@src/trpc/shared';
import ClientEventTime from './ClientEventTime';
import EventDeleteButton from './EventDeleteButton';
import EventEditButton from './EventEditButton';
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
      className="flex h-96 w-64 flex-col overflow-hidden"
    >
      <Link href={`/events/${event.id}`} className="grow flex flex-col">
        <div className="relative h-40 shrink-0 w-full">
          <div className="absolute inset-0 h-full w-full bg-slate-200 dark:text-slate-800" />
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
          <h3 className="text-xl font-medium">{event.name}</h3>
          <div className="text-base font-medium">
            {view !== 'manage' && view !== 'admin' && event.club.name}
            <div className="text-royal">
              <ClientEventTime
                startTime={event.startTime}
                endTime={event.endTime}
              />
            </div>
          </div>
        </div>
      </Link>
      <div className="m-4 mt-0 flex flex-row gap-2">
        {view === 'normal' && <EventRegisterButton eventId={event.id} />}
        {view === 'manage' &&
          (event.google ? (
            <Alert severity="info">Synced from Google Calendar.</Alert>
          ) : (
            <>
              <EventEditButton clubSlug={event.club.slug} eventId={event.id} />
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
      className="flex h-96 w-64 flex-col overflow-hidden"
    >
      <div className="grow flex flex-col">
        <div className="relative h-40 shrink-0 w-full">
          <Skeleton
            variant="rectangular"
            className="absolute inset-0 h-full w-full bg-slate-200 dark:bg-slate-800"
          />
        </div>
        <div className="flex h-full flex-col p-5 space-y-2.5">
          <Skeleton variant="text" className="text-xl font-medium" />
          <Skeleton variant="text" className="text-base font-medium" />
        </div>
        <div className="m-4 mt-0 flex flex-row gap-2">
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
      </div>
    </BaseCard>
  );
};
