import Image from 'next/image';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';
import JoinButton from '../JoinButton';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};
const ClubHeader = async ({ club }: { club: Club }) => {
  return (
    <div className="relative w-full aspect-[4.5/1] rounded-lg overflow-hidden">
      <Image
        src={club.bannerImage ?? '/images/wideWave.jpg'}
        alt="Club banner"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 z-10 flex flex-wrap items-center p-4 md:px-20 gap-4">
        <h1
          className={`font-display font-bold text-slate-100 text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] ${
            club.name.length > 10 ? 'text-3xl' : 'text-5xl'
          }`}
        >
          {club.name}
        </h1>
        <div className="ml-auto flex items-center gap-x-6">
          <JoinButton isHeader clubId={club.id} clubSlug={club.slug} />
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
