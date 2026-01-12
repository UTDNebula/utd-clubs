import Chip from '@mui/material/Chip';
import Image from 'next/image';
import { type RouterOutputs } from '@src/trpc/shared';
import JoinButton from '../JoinButton';

const ClubTitle = async ({
  club,
}: {
  club: NonNullable<RouterOutputs['club']['getDirectoryInfo']>;
}) => {
  return (
    <section
      id="club-tile"
      className="w-full rounded-lg flex flex-row md:flex-col items-start md:flex-row justify-between gap-4 mb-0 mt-2"
    >
      {club.profileImage && (
        <Image
          src={club.profileImage}
          alt={club.name + ' logo'}
          width={128}
          height={128}
          className="rounded-lg w-20 md:w-32 h-auto"
        />
      )}
      <div className="flex flex-col flex-grow">
        {club.name && (
          <h1
            className={`font-display font-bold text-slate-800 ${
              club.name.length > 40
                ? 'text-2xl md:text-3xl'
                : 'text-4xl md:text-5xl'
            }`}
          >
            {club.name}
          </h1>
        )}
        {club.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {club.tags.map((tag) => (
              <Chip
                label={tag}
                key={tag}
                className="font-semibold bg-cornflower-100 text-cornflower-600 hover:bg-cornflower-200"
              />
            ))}
          </div>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-6">
        <JoinButton isHeader clubId={club.id} clubSlug={club.slug} />
      </div>
    </section>
  );
};

export default ClubTitle;
