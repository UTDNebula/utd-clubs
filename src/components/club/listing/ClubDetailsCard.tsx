import { Tooltip } from '@mui/material';
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
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
    <Panel className="text-sm" id={id} smallPadding heading="Details">
      {club.numMembers ||
      club.foundingDate ||
      lastEventDate ||
      club.updatedAt ? (
        <>
          {club.numMembers && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Members
              </span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">{`${club.numMembers} ${club.numMembers !== 1 ? 'people' : 'person'}`}</span>
            </div>
          )}
          {club.foundingDate && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Founded
              </span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {club.foundingDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          {lastEventDate && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Last Event
              </span>
              <Tooltip
                title={lastEventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              >
                <span className="ml-auto text-slate-800 dark:text-slate-200">
                  {formatDistanceStrict(lastEventDate, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </Tooltip>
            </div>
          )}
          {club.updatedAt && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Updated
              </span>
              <Tooltip
                title={club.updatedAt.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              >
                <span className="ml-auto text-slate-800 dark:text-slate-200">
                  {formatDistanceStrict(club.updatedAt, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </Tooltip>
            </div>
          )}
        </>
      ) : (
        <span className="text-slate-600 dark:text-slate-400">No details</span>
      )}
    </Panel>
  );
}
