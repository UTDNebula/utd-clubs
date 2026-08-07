import Skeleton from '@mui/material/Skeleton';
import { EventCardSkeleton } from '@src/systems/events/EventCard';
import ManageHeader from '@src/systems/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events']}>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2 max-sm:gap-x-4">
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
        </div>
      </ManageHeader>
      <div className="flex w-full flex-wrap items-center justify-evenly gap-4 pt-10">
        {Array.from({ length: 9 }, (_, index) => (
          <EventCardSkeleton key={index} manageView />
        ))}
      </div>
    </>
  );
}
