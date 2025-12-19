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
    <section className="w-full rounded-lg flex flex-col items-start md:flex-row justify-between gap-4 mb-0 mt-2">
      {club.profileImage && (
        <Image
          src={club.profileImage}
          alt={club.name + ' logo'}
          width={110}
          height={110}
          className="rounded-lg"
        />
      )}
      <div className="flex flex-col flex-grow">
        {club.name && (
          <h1
            className={`font-display font-bold text-slate-800 text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] ${
              club.name.length > 10 ? 'text-3xl' : 'text-5xl'
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
                className="font-semibold"
                sx={{
                  backgroundColor: 'var(--color-cornflower-100)',
                  color: 'var(--color-cornflower-600)',
                  '&:hover': {
                    backgroundColor: 'var(--color-cornflower-200)',
                  },
                }}
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
