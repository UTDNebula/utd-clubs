import Panel from '@src/components/common/Panel';
import { RouterOutputs } from '@src/trpc/shared';

type ClubDetailsCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
  lastEventDate: Date | null;
  id?: string;
};
export default function ClubDetailsCard({
  club,
  lastEventDate,
  id,
}: ClubDetailsCardProps) {
  return (
    <Panel
      className="bg-neutral-50 shadow-sm text-sm"
      id={id}
      smallPadding
      heading="Details"
    >
      {club.numMembers ||
      club.foundingDate ||
      lastEventDate ||
      club.updatedAt ? (
        <>
          {club.numMembers && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Members</span>
              <span className="ml-auto text-slate-500">{`${club.numMembers} ${club.numMembers !== 1 ? 'people' : 'person'}`}</span>
            </div>
          )}
          {club.foundingDate && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Founded</span>
              <span className="ml-auto text-slate-500">
                {club.foundingDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {lastEventDate && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Last Event</span>
              <span className="ml-auto text-slate-500">
                {lastEventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {club.updatedAt && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Updated</span>
              <span className="ml-auto text-slate-500">
                {club.updatedAt.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
        </>
      ) : (
        <span className="text-slate-500">No details</span>
      )}
    </Panel>
  );
}
