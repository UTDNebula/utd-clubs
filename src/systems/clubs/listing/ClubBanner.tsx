import Image from 'next/image';
import { BaseCard } from '@nebula-library/components/BaseCard';
import type { SelectClub } from '@/server/db/models';
import { addVersionToImage } from '@/lib/utils/imageCacheBust';

type ClubBannerProps = {
  club: Pick<SelectClub, 'bannerImage' | 'updatedAt'>;
};

const ClubBanner = async ({ club }: ClubBannerProps) => {
  if (!club.bannerImage) {
    return null;
  }

  return (
    <BaseCard className="relative aspect-[4.5/1] w-full overflow-hidden">
      <Image
        src={addVersionToImage(club.bannerImage, club.updatedAt?.getTime())}
        alt="Club banner"
        fill
        className="object-cover object-center"
      />
    </BaseCard>
  );
};

export default ClubBanner;
