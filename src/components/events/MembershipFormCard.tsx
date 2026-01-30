'use client';

import { Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import { type RouterOutputs } from '@src/trpc/shared';
import { EventRegisterButtonSkeleton } from './EventRegisterButton';

interface EventCardProps {
  form: RouterOutputs['club']['clubForms'][number];
  view?: 'normal' | 'manage' | 'preview' | 'admin';
}

const MembershipFormCard = ({ form }: EventCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const showEventImage = !!form.image && !imgError;

  return (
    <BaseCard
      variant="interactive"
      className="flex h-72 w-64 flex-col overflow-hidden"
    >
      <Link
        href={form.url}
        className="grow flex flex-col"
        target="_blank"
        rel="noopener"
      >
        <div className="relative h-40 shrink-0 w-full bg-neutral-200 dark:bg-neutral-900">
          {/* shows fallback if form image is loading or error */}
          {(!showEventImage || !imgLoaded) && (
            <Image
              fill
              src={'' /** TODO: add a defailt link image */}
              alt="Club Form"
              className="object-cover object-center"
            />
          )}
          {/* render event image on top*/}
          {showEventImage && (
            <Image
              fill
              src={form.image!}
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
          <h3 className="text-lg font-medium">{form.name}</h3>
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
