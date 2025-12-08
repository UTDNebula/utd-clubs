import Skeleton from '@mui/material/Skeleton';
import ClubManageHeader from '@src/components/header/ClubManageHeader';

export default function Loading() {
  return (
    <>
      <ClubManageHeader loading path={['Events']}>
        <div className="flex gap-x-10">
          <Skeleton
            variant="rounded"
            width={128}
            height={40}
            className="rounded-full"
          />
        </div>
      </ClubManageHeader>
    </>
  );
}
