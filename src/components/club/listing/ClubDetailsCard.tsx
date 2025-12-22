import { RouterOutputs } from '@src/trpc/shared';

type ClubDetailsCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
  lastEventDate: Date | null;
};
export default function ClubDetailsCard({
  club,
  lastEventDate,
}: ClubDetailsCardProps) {
  return (
    <div className="flex flex-col bg-neutral-50 border-slate-200 shadow-sm  p-5 rounded-xl gap-2 text-sm text-slate-600">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Details</h2>
      {club.numMembers ||
      club.foundingDate ||
      lastEventDate ||
      club.updatedAt ? (
        <>
          {club.numMembers && (
            <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Members</span>
              <span className="text-slate-500">{club.numMembers}</span>
            </div>
          )}
          {club.foundingDate && (
            <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Founded</span>
              <span className="text-slate-50club0">
                {club.foundingDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {lastEventDate && (
            <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Last Event</span>
              <span className="text-slate-500">
                {lastEventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {club.updatedAt && (
            <div className="flex flex-row w-full justify-between py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-500">Updated</span>
              <span className="text-slate-500">
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
    </div>
  );
}
