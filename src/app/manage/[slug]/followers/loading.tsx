import { PanelSkeleton } from '@src/components/common/Panel';
import ManageHeader from '@src/components/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Followers']} />
      <div className="flex w-full flex-col items-center">
        <div className="flex flex-col gap-8 w-full max-w-6xl">
          <PanelSkeleton />
        </div>
      </div>
    </>
  );
}
