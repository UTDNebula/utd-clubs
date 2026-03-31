'use client';

import Button from '@mui/material/Button';
import Link from 'next/link';
import { UTDClubsLogoCombination } from '@src/icons/UTDClubsLogo';
import { useRegisterModal } from '../global/RegisterModalProvider';

export default function RequireLogin({ byline }: { byline?: string }) {
  const { setShowRegisterModal } = useRegisterModal();
  return (
    <main className="mb-5 flex flex-col sm:px-4 max-w-6xl mx-auto">
      <div className="flex flex-col items-center gap-y-4 pt-8 max-sm:px-4">
        <Link href="/">
          <UTDClubsLogoCombination
            duotone
            slotClassNames={{
              nebulaLogo: 'fill-haiti dark:fill-neutral-200',
              projectLogo: 'fill-royal dark:fill-periwinkle',
            }}
            className="max-h-32"
          />
        </Link>
        <h1 className="font-display text-center text-3xl font-bold">
          Please sign in or sign up
        </h1>
        <h2 className="font-display text-neutral-800 dark:text-neutral-200 text-center text-xl">
          {byline}
        </h2>
        <div className="flex gap-4">
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowRegisterModal(true)}
          >
            Sign in
          </Button>
        </div>
      </div>
    </main>
  );
}
