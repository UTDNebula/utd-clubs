import { Skeleton } from '@mui/material';
import { PanelSkeleton } from '@nebula-library/components/Panel';
import ManageHeader from '@/systems/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading hrefBack="/manage">
        <div className="flex gap-x-10">
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
        </div>
      </ManageHeader>
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
          <PanelSkeleton />
        </div>
      </div>
    </>
  );
}
