import Image from 'next/image';
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
      {event.image && (
        <Image
          src={event.image}
          alt="Event poster"
          height={256}
          width={512}
          className="rounded-lg mb-6 max-h-64 w-fit mx-auto object-contain object-center"
        />
      )}
      <ExpandableMarkdownText
        text={
          event.description.length > 0 ? event.description : '**Check us out!**'
        }
        maxLines={10}
      />
    </Panel>
  );
}
