import { Tooltip } from '@mui/material';
import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';
import Panel from '@src/components/common/Panel';
import { RouterOutputs } from '@src/trpc/shared';

type EventDetailsCardProps = {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
  id?: string;
};
export default function EventDetailsCard({ event, id }: EventDetailsCardProps) {
  return (
    <Panel className="text-sm" id={id} smallPadding heading="Details">
      {event.numParticipants || event.updatedAt ? (
        <>
          {event.numParticipants !== 0 && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Participants
              </span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">{`${event.numParticipants} ${event.numParticipants !== 1 ? 'people' : 'person'}`}</span>
            </div>
          )}
          {event.updatedAt && (
            <div className="flex flex-row flex-wrap gap-1 py-1 border-b border-slate-100 last:border-0">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Updated
              </span>
              <Tooltip
                title={event.updatedAt.toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              >
                <span className="ml-auto text-slate-800 dark:text-slate-200">
                  {formatDistanceStrict(event.updatedAt, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </Tooltip>
            </div>
          )}
        </>
      ) : (
        <span className="text-slate-600">No details</span>
      )}
    </Panel>
  );
}
