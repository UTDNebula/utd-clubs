import { Divider, Tooltip } from '@mui/material';
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
import Panel from '@src/components/common/Panel';
import { RouterOutputs } from '@src/trpc/shared';

type EventDetailsCardProps = {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
  id?: string;
};
export default function EventDetailsCard({ event, id }: EventDetailsCardProps) {
  const items = [];

  if (event.numParticipants !== 0) {
    items.push(
      <div key="participants" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Participants
        </span>
        <span className="ml-auto text-slate-800 dark:text-slate-200">{`${event.numParticipants} ${event.numParticipants !== 1 ? 'people' : 'person'}`}</span>
      </div>,
    );
  }
  if (event.updatedAt) {
    items.push(
      <div key="updated" className="flex flex-row flex-wrap gap-1 py-1">
        <span className="font-medium text-slate-600 dark:text-slate-400">
          Updated
        </span>
        <Tooltip
          title={event.updatedAt.toLocaleString('en-us', {
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
            {formatDistanceStrict(event.updatedAt, new Date(), {
              addSuffix: true,
            })}
          </span>
        </Tooltip>
      </div>,
    );
  }

  return (
    <Panel className="text-sm" id={id} smallPadding heading="Details">
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
    </Panel>
  );
}
