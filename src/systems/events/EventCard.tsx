'use client';

import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Skeleton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BaseCard } from '@nebula-library/components/BaseCard';
import { type RouterOutputs } from '@/trpc/shared';
import { addVersionToImage } from '@/common/utils/imageCacheBust';
import ClientEventTime from './ClientEventTime';
import EventDeleteButton from './EventDeleteButton';
import EventRegisterButton, {
  EventRegisterButtonPreview,
  EventRegisterButtonSkeleton,
} from './EventRegisterButton';
import EventTimeAlert from './EventTimeAlert';

export type EventCardVariants = 'card' | 'list';

interface EventCardProps {
  event: RouterOutputs['event']['byClubId'][number];
  /**
   * @default "card"
   */
  variant?: EventCardVariants;
  /**
   * @default "normal"
   */
  view?: 'normal' | 'manage' | 'preview' | 'admin';
  className?: string;
  responsive?: boolean;
}

const EventCard = ({
  event,
  variant = 'card',
  view = 'normal',
  className,
  responsive = false,
}: EventCardProps) => {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const showEventImage = !!event.image && !imgError;

  const EventImage = (
    <div className="aspect-[1.6]">
      {/* shows fallback if event image is loading, error, or no link */}
      {event.club.profileImage && (!showEventImage || !imgLoaded) && (
        <Image
          fill
          src={addVersionToImage(
            event.club.profileImage,
            event.club.updatedAt?.getTime(),
          )}
          alt="Club Profile"
          className="object-cover object-center"
        />
      )}
      {/* render event image on top*/}
      {showEventImage && (
        <Image
          fill
          src={addVersionToImage(event.image!, event.updatedAt.getTime())}
          alt="Event Image"
          className={`object-cover object-center transition-opacity duration-300 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
        />
      )}
    </div>
  );

  const EventButtons = (
    <>
      {view === 'normal' && (
        <EventRegisterButton
          clubId={event.club.id}
          clubSlug={event.club.slug}
          eventId={event.id}
          calendarId={event.club.calendarId}
          fromGoogle={event.google}
        />
      )}
      {view === 'manage' &&
        (event.google ? (
          <>
            <EventRegisterButton
              clubId={event.club.id}
              clubSlug={event.club.slug}
              eventId={event.id}
              calendarId={event.club.calendarId}
              fromGoogle={event.google}
            />
          </>
        ) : (
          <>
            <EventRegisterButton
              clubId={event.club.id}
              clubSlug={event.club.slug}
              eventId={event.id}
              calendarId={event.club.calendarId}
              fromGoogle={event.google}
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
    </>
  );

  switch (variant) {
    case 'list':
      return (
        <BaseCard
          variant={smallScreen ? 'transparent' : 'interactive'}
          className={`relative flex min-h-15 w-full flex-col overflow-hidden max-sm:rounded-none max-sm:has-[.EventCardLink:focus]:bg-neutral-500/20 sm:bg-white sm:has-[.EventCardLink:focus]:bg-neutral-200 sm:dark:bg-neutral-800 sm:dark:has-[.EventCardLink:focus]:bg-neutral-700 ${className ?? ''}`}
        >
          <Link
            href={`/events/${event.id}`}
            className="EventCardLink absolute inset-0 z-10"
          />
          <div className="flex flex-row gap-5 max-sm:gap-3 max-sm:pl-4">
            <div className="flex min-w-24 shrink basis-64 items-center">
              <div className="relative aspect-[1.6] w-full">
                {EventImage}
                <div className="pointer-events-none absolute inset-0 origin-top-left p-2 max-sm:scale-75 max-sm:p-1">
                  <EventTimeAlert event={event} />
                </div>
                {event.google && (
                  <div className="absolute top-0 right-0 origin-top-right p-2 max-sm:scale-75 max-sm:p-1">
                    <Tooltip title="Synced from Google Calendar.">
                      <GoogleIcon />
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
            <div className="@container/event-list-content min-h-full shrink grow basis-96 pl-0! max-sm:p-2 sm:p-5">
              <div className="flex h-full flex-col gap-4 @sm/event-list-content:flex-row @sm/event-list-content:justify-between @sm/event-list-content:gap-2">
                <div className="flex flex-col sm:gap-2">
                  <h3 className="line-clamp-2 text-base font-medium sm:text-xl">
                    {event.name}
                  </h3>
                  {view !== 'manage' && view !== 'admin' && (
                    <div className="line-clamp-2 text-base font-medium text-neutral-600 max-sm:text-[0.75rem] dark:text-neutral-400">
                      {event.club.name}
                    </div>
                  )}
                  <div className="text-royal dark:text-cornflower-300 text-base max-sm:text-[0.75rem]">
                    <ClientEventTime
                      startTime={event.startTime}
                      endTime={event.endTime}
                    />
                  </div>
                </div>
                <div
                  className={`${view === 'normal' ? 'max-sm:hidden' : ''} z-20 shrink-0 @max-sm/event-list-content:-mb-3 @sm/event-list-content:self-center`}
                >
                  <div className="flex h-fit flex-wrap gap-2">
                    {EventButtons}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      );

    default:
    case 'card':
      return (
        <BaseCard
          variant="interactive"
          className={`relative flex ${responsive ? 'min-h-104 min-w-64' : 'h-104 w-64'} flex-col overflow-hidden bg-white has-[.EventCardLink:focus]:bg-neutral-200 dark:bg-neutral-800 dark:has-[.EventCardLink:focus]:bg-neutral-700 ${className ?? ''}`}
        >
          <Link
            href={`/events/${event.id}`}
            className="EventCardLink absolute inset-0 z-10"
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative min-h-40 w-full shrink-0">
              {EventImage}
              <div className="pointer-events-none absolute inset-0 p-2">
                <EventTimeAlert event={event} />
              </div>
              {event.google && (
                <div className="absolute top-0 right-0 p-2">
                  <Tooltip title="Synced from Google Calendar.">
                    <GoogleIcon />
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2.5 p-5">
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

            <div className="z-20 m-4 mt-auto flex shrink-0 flex-wrap gap-2">
              {EventButtons}
            </div>
          </div>
        </BaseCard>
      );
  }
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
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="relative h-40 w-full shrink-0">
          <Skeleton
            variant="rectangular"
            className="absolute inset-0 h-full w-full bg-white dark:bg-neutral-800"
          />
        </div>
        <div className="flex flex-col space-y-2.5 p-5">
          <Skeleton variant="text" className="text-xl font-medium" />
          <Skeleton variant="text" className="text-base font-medium" />
          <Skeleton variant="text" className="text-base" />
        </div>
      </div>
      <div className="m-4 mt-auto flex shrink-0 flex-row gap-2">
        <EventRegisterButtonSkeleton />
        {manageView && (
          <>
            <Skeleton
              variant="rounded"
              className="rounded-full"
              width={67}
              height={34}
            />
            <Skeleton
              variant="rounded"
              className="rounded-full"
              width={34}
              height={34}
            />
          </>
        )}
      </div>
    </BaseCard>
  );
};
