import { PanelSkeleton } from '@src/components/form/Panel';
import ManageHeader from '@src/components/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Members']} />
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col gap-8 w-full max-w-6xl">
          <PanelSkeleton />
        </div>
      </div>
    </>
  );
}
