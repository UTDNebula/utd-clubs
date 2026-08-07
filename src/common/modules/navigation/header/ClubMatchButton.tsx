'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useRef } from 'react';
import { authClient } from '@src/utils/auth-client';
import { useLoginModal } from '@src/common/modules/loginModal';

const shadowStyle = 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]';

const icon = <Diversity3Icon fontSize="small" />;

export default function ClubMatchButton({
  shadow,
  iconOnly,
}: {
  shadow?: boolean;
  iconOnly?: boolean;
}) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const useAuthPage = useRef(false);
  const { openLoginModal } = useLoginModal({
    onNoProvider: () => {
      useAuthPage.current = true;
    },
  });

  const handleButtonClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (!session) {
      e.preventDefault();
      // Use auth page if not not wrapped in a `<LoginModalProvider>`
      if (useAuthPage.current) {
        router.push(
          `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`,
        );
      } else {
        openLoginModal();
      }
    }
  };

  return iconOnly ? (
    <IconButton
      LinkComponent={Link}
      onClick={handleButtonClick}
      href="/club-match/results"
      size="large"
      className={`dark:text-haiti h-10 w-10 rounded-full bg-[var(--mui-palette-primary-main)] text-white hover:bg-[var(--mui-palette-primary-dark)] ${shadow ? shadowStyle : ''}`}
      aria-label="Club Match"
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      LinkComponent={Link}
      onClick={handleButtonClick}
      href="/club-match/results"
      variant="contained"
      className={`h-10 px-5 py-2 whitespace-nowrap normal-case ${shadow ? shadowStyle : ''}`}
      startIcon={icon}
      disableElevation
    >
      Club Match
    </Button>
  );
}
