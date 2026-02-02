import Image from 'next/image';
import { BaseCard } from '@src/components/common/BaseCard';
import type {
  SelectContact as Contacts,
  SelectClub,
} from '@src/server/db/models';

type Club = SelectClub & {
  contacts?: Contacts[];
  tags: string[];
};
const ClubEventHeader = async ({ club }: { club: Club }) => {
  if (!club.bannerImage) {
    return null;
  }

  return (
    <BaseCard className="relative w-full aspect-[4.5/1] overflow-hidden">
      <Image
        src={club.bannerImage}
        alt="Club banner"
        fill
        className="object-cover object-center"
      />
    </BaseCard>
  );
};

export default ClubEventHeader;
