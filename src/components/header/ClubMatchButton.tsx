'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../global/RegisterModalProvider';
import { useEffect, useState } from 'react';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { setShowRegisterModal } = useRegisterModal();

  const handleClick = !session
    ? () => {
        setShowRegisterModal(true);
      }
    : undefined;

  const hrefConditionalProp = isMounted && session ? { href: '/club-match/results' } : {};

  return iconOnly ? (
    <IconButton
      LinkComponent={Link}
      {...hrefConditionalProp}
      size="large"
      className={`rounded-full w-10 h-10 bg-[var(--mui-palette-primary-main)] hover:bg-[var(--mui-palette-primary-dark)] text-white dark:text-haiti ${shadow ? shadowStyle : ''}`}
      onClick={handleClick}
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      LinkComponent={Link}
      {...hrefConditionalProp}
      variant="contained"
      className={`normal-case px-5 py-2 h-10 whitespace-nowrap ${shadow ? shadowStyle : ''}`}
      startIcon={icon}
      onClick={handleClick}
      disableElevation
    >
      Club Match
    </Button>
  );
}
