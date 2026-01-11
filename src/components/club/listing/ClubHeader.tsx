import Image from 'next/image';
import { BaseCard } from '@src/components/common/BaseCard';
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
    <BaseCard className="relative min-h-64 overflow-hidden">
      <Image
        src={club.bannerImage ?? '/images/wideWave.jpg'}
        alt="Club banner"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 flex flex-wrap min-h-64 h-full w-full items-center p-4 md:p-20 gap-4">
        <h1
          className={`font-display font-bold text-slate-100 dark:text-slate-900 text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)] ${
            club.name.length > 10 ? 'text-3xl' : 'text-5xl'
          }`}
        >
          {club.name}
        </h1>
        <div className="ml-auto flex items-center gap-x-6">
          <JoinButton isHeader clubId={club.id} clubSlug={club.slug} />
        </div>
      </div>
    </BaseCard>
  );
};

export default ClubHeader;
