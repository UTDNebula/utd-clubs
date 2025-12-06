'use client';

import { Button } from '@mui/material';
import Link from 'next/link';
import { authClient } from '@src/utils/auth-client';
import {
  NoRegisterModalProviderError,
  useRegisterModalContext,
} from '../account/RegisterModalProvider';

export default function ClubMatchButton({ shadow }: { shadow?: boolean }) {
  const { data: session } = authClient.useSession();

  let setShowRegisterModal: (value: boolean) => void;
  try {
    const context = useRegisterModalContext();
    setShowRegisterModal = context.setShowRegisterModal;
  } catch (e) {
    if (e instanceof NoRegisterModalProviderError) {
    } else {
      throw e;
    }
  }

  return (
    <Link href={(session && '/club-match/results') ?? ''}>
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
