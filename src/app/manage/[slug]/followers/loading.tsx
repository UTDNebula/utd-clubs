import { PanelSkeleton } from '@src/nebula-library/components/Panel';
import ManageHeader from '@src/components/manage/ManageHeader';

export default function Loading() {
  return (
    <>
      <ManageHeader loading path={['Followers']} />
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-6xl flex-col gap-8">
          <PanelSkeleton />
        </div>
      </div>
    </>
  );
}
