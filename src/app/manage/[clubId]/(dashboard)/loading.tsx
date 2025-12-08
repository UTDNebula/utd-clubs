import { Skeleton } from '@mui/material';
import ClubManageHeader from '@src/components/header/ClubManageHeader';

export default function Loading() {
  return (
    <>
      <ClubManageHeader loading hrefBack="/manage">
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
      </ClubManageHeader>
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col gap-8">
          <Skeleton variant="rounded" height={128} />
          <Skeleton variant="rounded" height={128} />
          <Skeleton variant="rounded" height={128} />
          <Skeleton variant="rounded" height={128} />
        </div>
      </div>
    </>
  );
}
