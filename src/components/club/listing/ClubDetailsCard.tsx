import { Divider, Tooltip } from '@mui/material';
import { subMinutes } from 'date-fns';
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
  const items = [];

  if (club.numMembers !== 0) {
    items.push(
      <div key="members" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Followers
        </span>
        <span className="ml-auto text-slate-800 dark:text-slate-200">{`${club.numMembers} ${club.numMembers !== 1 ? 'people' : 'person'}`}</span>
      </div>,
    );
  }
  if (club.foundingDate) {
    items.push(
      <div key="foundingDate" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Founded
        </span>
        <span className="ml-auto text-slate-800 dark:text-slate-200">
          {club.foundingDate.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>,
    );
  }
  if (lastEventDate) {
    items.push(
      <div key="lastEventDate" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Last Event
        </span>
        <Tooltip
          title={lastEventDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        >
          <span className="ml-auto text-slate-800 dark:text-slate-200">
            {lastEventDate > subMinutes(new Date(), 5)
              ? 'Ongoing'
              : formatDistanceStrict(lastEventDate, new Date(), {
                  addSuffix: true,
                })}
          </span>
        </Tooltip>
      </div>,
    );
  }
  if (club.updatedAt) {
    items.push(
      <div key="updatedAt" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Updated
        </span>
        <Tooltip
          title={club.updatedAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        >
          <span className="ml-auto text-slate-800 dark:text-slate-200">
            {formatDistanceStrict(club.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </span>
        </Tooltip>
      </div>,
    );
  }

  return (
    <Panel className="text-sm" id={id} smallPadding heading="Details">
      <div className="flex flex-col gap-1">
        {items.length ? (
          items.flatMap((item, index) => {
            const row = [item];
            if (index < items.length - 1) {
              row.push(<Divider key={index} />);
            }
            return row;
          })
        ) : (
          <span className="text-slate-600 dark:text-slate-400">No details</span>
        )}
      </div>
    </Panel>
  );
}
