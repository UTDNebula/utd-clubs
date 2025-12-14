import Skeleton from '@mui/material/Skeleton';
import { EventCardSkeleton } from '@src/components/events/EventCard';
import ManageHeader from '@src/components/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Events']}>
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
        </div>
      </ManageHeader>
      <div className="flex flex-wrap w-full justify-evenly items-center pt-10 gap-4">
        {Array.from({ length: 9 }, (_, index) => (
          <EventCardSkeleton key={index} manageView />
        ))}
      </div>
    </>
  );
}
