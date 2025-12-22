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
      className="group flex h-96 w-64 flex-col overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-slate-200"
    >
      <Link href={`/events/${event.id}`} className="grow flex flex-col">
        <div className="relative h-44 shrink-0 w-full overflow-hidden">
          <div className="absolute inset-0 h-full w-full bg-slate-200" />
          {src && (
            <Image
              fill
              src={src}
              alt="event image"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          )}
          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          <div className="absolute inset-0 p-3">
            <EventTimeAlert event={event} />
          </div>
        </div>
        <div className="flex h-full flex-col p-5">
          <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2 transition-colors group-hover:text-royal">
            {event.name}
          </h3>

          <div className="mt-auto space-y-1">
            {view !== 'manage' && (
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {event.club.name}
              </p>
            )}
            <div className="text-sm font-medium text-royal/80">
              <ClientEventTime
                startTime={event.startTime}
                endTime={event.endTime}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-5 pb-5 mt-0 flex flex-row gap-2">
        {view === 'normal' && (
          <div className="w-full transform transition-transform duration-300 group-hover:translate-y-[-2px]">
            <EventRegisterButton eventId={event.id} />
          </div>
        )}
        {view === 'manage' &&
          (event.google ? (
            <Alert severity="info" className="py-0 px-2 text-xs">
              Synced from Google
            </Alert>
          ) : (
            <div className="flex gap-2 w-full">
              <EventEditButton clubSlug={event.club.slug} eventId={event.id} />
              <EventDeleteButton event={event} />
            </div>
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
      className="flex h-96 w-64 flex-col overflow-hidden border border-slate-100"
    >
      <div className="grow flex flex-col">
        <div className="relative h-44 shrink-0 w-full bg-slate-100" />
        <div className="flex h-full flex-col p-5 space-y-3">
          <Skeleton variant="text" className="font-bold" />
          <Skeleton variant="text" className="text-xs font-bold" />
        </div>
        <div className="p-5 pt-0 flex flex-row gap-2">
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
