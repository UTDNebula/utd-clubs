'use client';

import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Skeleton, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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

const MembershipFormCard = ({ event, view = 'normal' }: EventCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const showEventImage = !!event.image && !imgError;

  return (
    <BaseCard
      variant="interactive"
      className="flex h-72 w-64 flex-col overflow-hidden"
    >
      <Link href={`https://coda.io/form/AIM-S26-Mentee-Application_dw1wTJ2KU3J?utm_source=ig&utm_medium=social&utm_content=link_in_bio`} className="grow flex flex-col" target="_blank" rel="noopener">
        <div className="relative h-40 shrink-0 w-full bg-neutral-200 dark:bg-neutral-900">
          {/* shows fallback if event image is loading, error, or no link */}
          {event.club.profileImage && (!showEventImage || !imgLoaded) && (
            <Image
              fill
              src={event.club.profileImage}
              alt="Club Profile"
              className="object-cover object-center"
            />
          )}
          {/* render event image on top*/}
          {showEventImage && (
            <Image
              fill
              src={event.image!}
              alt="Event Image"
              className={`object-cover object-center transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
            />
          )}
        </div>
        <div className="flex h-full flex-col p-5 space-y-2.5">
          <h3 className="text-lg font-medium">{event.name}</h3>
        </div>
      </Link>
    </BaseCard>
  );
};

export default MembershipFormCard;

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
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-neutral-800"
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
