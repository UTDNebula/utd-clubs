'use client';

import { Skeleton } from '@mui/material';
import { EventRegisterButtonSkeleton } from './EventRegisterButton';

interface EventCardSkeletonProps {
  manageView?: boolean;
}

const EventCardSkeleton = ({ manageView }: EventCardSkeletonProps) => {
  return (
    <div className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
      <div className="grow flex flex-col">
        <div className="relative h-40 shrink-0 w-full">
          <div className="absolute inset-0 h-full w-full bg-gray-200" />
        </div>
        <div className="flex h-full flex-col p-5 space-y-2.5">
          <Skeleton variant="text" className="font-bold" />
          <Skeleton variant="text" className="text-xs font-bold" />
        </div>
        <div className="m-4 mt-0 flex flex-row gap-2">
          {!manageView && <EventRegisterButtonSkeleton />}
          {manageView && (
            <>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
