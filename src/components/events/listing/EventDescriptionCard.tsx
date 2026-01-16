import Panel from '@src/components/common/Panel';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { RouterOutputs } from '@src/trpc/shared';

type EventDescriptionCardProps = {
  event: NonNullable<RouterOutputs['event']['getListingInfo']>;
  id?: string;
};

export default function EventDescriptionCard({
  event,
  id,
}: EventDescriptionCardProps) {
  return (
    <Panel className="!p-10 text-slate-700" id={id}>
      <ExpandableMarkdownText
        text={
          event.description.length > 0 ? event.description : '**Check us out!**'
        }
        maxLines={10}
      />
    </Panel>
  );
}
