import { Skeleton } from '@mui/material';
import { FormFieldSetSkeleton } from '@src/components/form/FormFieldSet';
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
        <div className="flex flex-col gap-8">
          <FormFieldSetSkeleton className="max-w-2xl" />
          <FormFieldSetSkeleton className="max-w-2xl" />
          <FormFieldSetSkeleton className="max-w-2xl" />
          <FormFieldSetSkeleton className="max-w-2xl" />
        </div>
      </div>
    </>
  );
}
