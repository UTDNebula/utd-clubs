'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import { type RouterOutputs } from '@src/trpc/shared';

interface MembershipFormCardProps {
  form: RouterOutputs['club']['clubForms'][number];
  view?: 'normal' | 'manage' | 'preview' | 'admin';
}

const MembershipFormCard = ({ form }: MembershipFormCardProps) => {
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Fetch the OpenGraph image when the component mounts
  useEffect(() => {
    const fetchOgImage = async () => {
      try {
        const res = await fetch(
          `/api/og-scraper?url=${encodeURIComponent(form.url)}`,
        );
        const data = await res.json();

        if (data.ogImage) {
          setOgImage(data.ogImage);
        } else {
          setImgError(true);
        }
      } catch (error) {
        console.error('Failed to fetch OG image', error);
        setImgError(true);
      }
    };

    fetchOgImage();
  }, [form.url]);

  const showFormImage = !!ogImage && !imgError;

  return (
    <BaseCard
      variant="interactive"
      className="flex h-72 w-60 flex-col overflow-hidden bg-white dark:bg-neutral-800"
    >
      <Link
        href={form.url}
        className="grow flex flex-col"
        target="_blank"
        rel="noopener"
      >
        <div className="relative h-40 shrink-0 w-full bg-neutral-300 dark:bg-neutral-700">
          {/* render form image on top*/}
          {showFormImage && (
            <Image
              fill
              src={ogImage}
              alt="Form Image"
              className={`object-cover object-center transition-opacity duration-300 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => setImgError(true)}
              onLoad={() => setImgLoaded(true)}
            />
          )}
        </div>
        <div className="flex h-full flex-col p-5 space-y-2.5">
          <h3 className="text-lg font-medium">{form.name}</h3>
        </div>
      </Link>
    </BaseCard>
  );
};

export default MembershipFormCard;
