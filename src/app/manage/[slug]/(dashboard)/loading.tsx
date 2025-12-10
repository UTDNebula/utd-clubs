import { Skeleton } from '@mui/material';
import { FormFieldSetSkeleton } from '@src/components/form/FormFieldSet';
import ManageHeader from '@src/components/manage/ManageHeader';

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
        <div className="flex flex-col gap-8 w-full max-w-6xl">
          <FormFieldSetSkeleton />
          <FormFieldSetSkeleton />
          <FormFieldSetSkeleton />
          <FormFieldSetSkeleton />
          <FormFieldSetSkeleton />
        </div>
      </div>
    </>
  );
}
