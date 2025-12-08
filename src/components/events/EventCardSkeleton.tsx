'use client';

import { Skeleton } from '@mui/material';
import { EventRegisterButtonSkeleton } from './EventRegisterButton';

interface EventCardSkeletonProps {
  manageView?: boolean;
}

const EventCardSkeleton = ({ manageView }: EventCardSkeletonProps) => {
  return (
    <>
      <div className="hidden lg:group-data-[view=list]:contents">
        <div className="flex h-40 w-full flex-row overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
          <div className="relative h-[160px] w-1/3 max-w-[225px]">
            <div className="absolute inset-0 h-full w-full bg-gray-200" />
          </div>
          <div className="flex w-full flex-row px-6 py-5">
            <div className="flex flex-col space-y-2.5 grow">
              <Skeleton variant="text" className="font-bold w-1/2" />
              <Skeleton variant="text" className="text-xs font-bold w-1/2" />

              <Skeleton variant="text" className="text-xs font-bold w-1/2" />
              <Skeleton variant="text" className="text-xs font-bold w-1/4" />
            </div>
            <div className="ml-auto flex flex-row gap-2 h-fit self-center">
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
      </div>
      <div className="contents lg:group-data-[view=list]:hidden">
        <div className="flex h-96 w-64 flex-col overflow-hidden rounded-lg bg-white shadow-xs transition-shadow hover:shadow-lg">
          <div className="relative h-40 shrink-0 w-full">
            <div className="absolute inset-0 h-full w-full bg-gray-200" />
          </div>
          <div className="flex h-full flex-col p-5">
            <div className="space-y-2.5">
              <Skeleton variant="text" className="font-bold" />
              <Skeleton variant="text" className="text-xs font-bold" />
            </div>
            <div className="mt-auto flex flex-row gap-2">
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
      </div>
    </>
  );
};

export default EventCardSkeleton;
