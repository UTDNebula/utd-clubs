import Panel from '@src/components/common/Panel';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { RouterOutputs } from '@src/trpc/shared';

type ClubDescriptionCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
  id?: string;
};

export default function ClubDescriptionCard({
  club,
  id,
}: ClubDescriptionCardProps) {
  return (
    <Panel className="!p-10" id={id}>
      <ExpandableMarkdownText
        text={
          club.description.length > 0
            ? club.description
            : 'No description provided'
        }
        maxLines={10}
      />
    </Panel>
  );
}
