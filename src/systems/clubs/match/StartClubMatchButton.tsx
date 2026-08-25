'use client';

import { ButtonProps } from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useRef, useState } from 'react';
import { LinkButton } from '@/lib/components/LinkButton';
import { Binoculars } from '@/lib/icons/OtherIcons';
import { useLoginModal } from '@/lib/modules/loginModal';
import { authClient } from '@/lib/utils/auth-client';

interface StartClubMatchButtonProps extends ButtonProps {
  label?: string;
  enableLoading?: boolean;
  loadingLabel?: string;
}

export default function StartClubMatchButton({
  label = 'Start now!',
  enableLoading,
  loadingLabel,
  ...props
}: StartClubMatchButtonProps) {
  const [loading, setLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const router = useRouter();
  const useAuthPage = useRef(false);
  const { openLoginModal } = useLoginModal({
    onNoProvider: () => {
      useAuthPage.current = true;
    },
  });

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (enableLoading) setLoading(true);
    if (!session) {
      e.preventDefault();
      // Use auth page if not not wrapped in a `<LoginModalProvider>`
      if (useAuthPage.current) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        openLoginModal({
          callbackURL: '/club-match/form',
          onClose: () => {
            setLoading(false);
          },
          explanationText: 'Account required for club match to combat spam',
        });
      }
    }
  };

  return (
    <LinkButton
      variant="contained"
      onClick={handleButtonClick}
      href="/club-match/form"
      size="large"
      color="primary"
      loading={loading}
      loadingPosition="start"
      startIcon={<Binoculars />}
      {...props}
    >
      {loading && loadingLabel ? loadingLabel : label}
    </LinkButton>
  );
}
