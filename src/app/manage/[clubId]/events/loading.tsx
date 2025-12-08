import Skeleton from '@mui/material/Skeleton';
import EventCardSkeleton from '@src/components/events/EventCardSkeleton';
import ClubManageHeader from '@src/components/header/ClubManageHeader';

export default function Loading() {
  return (
    <>
      <ClubManageHeader loading path={['Events']}>
        <div className="flex flex-wrap items-center gap-x-10 max-sm:gap-x-4 gap-y-2">
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
        </div>
      </ClubManageHeader>
      <div
        className="group flex flex-wrap w-full justify-evenly items-center pt-4 gap-4"
        data-view="list"
      >
        {Array.from({ length: 9 }, (_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
