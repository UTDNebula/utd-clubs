import Image from 'next/image';
import { ClubTags } from '@src/systems/clubs/ClubTags';
import { type RouterOutputs } from '@src/trpc/shared';
import { addVersionToImage } from '@src/utils/imageCacheBust';
import JoinButton from '../JoinButton';

const ClubTitle = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  return (
    <section
      id="club-title"
      className="flex w-full flex-col items-start justify-between gap-4 rounded-lg md:flex-row md:items-center"
    >
      <div
        className={`flex ${club.name.length > 40 ? 'flex-col' : 'flex-row'} w-full flex-grow items-start gap-4 md:w-auto md:flex-row`}
      >
        {club.profileImage && (
          <Image
            src={addVersionToImage(
              club.profileImage,
              club.updatedAt?.getTime(),
            )}
            alt={club.name + ' logo'}
            width={128}
            height={128}
            // flex-shrink-0 prevents the image from squishing if text is long
            className="h-auto w-20 flex-shrink-0 rounded-lg md:w-32"
          />
        )}

        <div className="flex min-w-0 flex-grow flex-col overflow-hidden">
          {club.name && (
            <h1
              className={`font-display font-bold text-slate-800 dark:text-slate-200 ${
                club.name.length > 40
                  ? 'text-xl md:text-3xl'
                  : club.name.length > 12
                    ? 'text-2xl md:text-5xl'
                    : 'text-4xl md:text-5xl'
              }`}
            >
              {club.name}
            </h1>
          )}
          {club.tags && club.tags.length > 0 && <ClubTags tags={club.tags} />}
        </div>
      </div>
      <div className="flex w-full flex-shrink-0 justify-end md:ml-auto md:w-auto">
        <JoinButton isHeader clubId={club.id} clubSlug={club.slug} />
      </div>
    </section>
  );
};

export default ClubTitle;
