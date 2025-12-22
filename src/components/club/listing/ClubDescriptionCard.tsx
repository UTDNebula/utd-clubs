import { BaseCard } from '@src/components/common/BaseCard';
import ExpandableMarkdownText from '@src/components/ExpandableMarkdownText';
import { RouterOutputs } from '@src/trpc/shared';

type ClubDescriptionCardProps = {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
};

export default function ClubDescriptionCard({
  club,
}: ClubDescriptionCardProps) {
  return (
    <BaseCard className="bg-neutral-50 border-slate-200 shadow-sm p-10 grow text-slate-700">
      <ExpandableMarkdownText
        text={
          club.description.length > 0 ? club.description : '**Check us out!**'
        }
        maxLines={10}
      />
    </BaseCard>
  );
}
