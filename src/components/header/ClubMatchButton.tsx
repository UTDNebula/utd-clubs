'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../account/RegisterModalProvider';

export default function ClubMatchButton({ shadow }: { shadow?: boolean }) {
  const { data: session } = authClient.useSession();

  const { setShowRegisterModal } = useRegisterModal();

  return (
    <Link href={(session && '/club-match/results') ?? ''} scroll={!!session}>
      <Button
        variant="contained"
        className={`rounded-full normal-case ${shadow ? 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]' : ''}`}
        onClick={
          !session
            ? () => {
                setShowRegisterModal(true);
              }
            : undefined
        }
      >
        Club Match
      </Button>
    </Link>
  );
}
