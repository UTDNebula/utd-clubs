import Image from 'next/image';
import { ClubTags } from '@src/components/common/ClubTags';
import { type RouterOutputs } from '@src/trpc/shared';
import JoinButton from '../JoinButton';

const ClubTitle = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  return (
    <section
      id="club-title"
      className="w-full rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-0 mt-2"
    >
      <div
        className={`flex ${club.name.length > 40 ? 'flex-col ' : 'flex-row '} md:flex-row gap-4 w-full md:w-auto flex-grow items-start`}
      >
        {club.profileImage && (
          <Image
            src={club.profileImage}
            alt={club.name + ' logo'}
            width={128}
            height={128}
            // flex-shrink-0 prevents the image from squishing if text is long
            className="rounded-lg w-20 md:w-32 h-auto flex-shrink-0"
          />
        )}

        <div className="flex flex-col flex-grow min-w-0 overflow-hidden">
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
      <div className="w-full md:w-auto flex-shrink-0 flex md:ml-auto justify-end">
        <JoinButton isHeader clubId={club.id} clubSlug={club.slug} />
      </div>
    </section>
  );
};

export default ClubTitle;
