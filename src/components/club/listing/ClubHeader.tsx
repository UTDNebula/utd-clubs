import Image from 'next/image';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};
const ClubHeader = async ({ club }: { club: Club }) => {
  return (
    <div className="relative w-full aspect-[4.5/1] rounded-lg overflow-hidden">
      <Image
        src={club.bannerImage ?? club.profileImage ?? '/images/wideWave.jpg'}
        alt="Club banner"
        fill
        className="object-cover object-center"
        priority
      />
    </div>
  );
};

export default ClubHeader;
