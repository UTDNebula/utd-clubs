'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../global/RegisterModalProvider';

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

  const { setShowRegisterModal } = useRegisterModal();

  const handleClick = !session
    ? () => {
        setShowRegisterModal(true);
      }
    : undefined;

  const hrefConditionalProp = session ? { href: '/club-match/results' } : {};

  return iconOnly ? (
    <IconButton
      LinkComponent={Link}
      {...hrefConditionalProp}
      size="large"
      className={`dark:text-haiti h-10 w-10 rounded-full bg-[var(--mui-palette-primary-main)] text-white hover:bg-[var(--mui-palette-primary-dark)] ${shadow ? shadowStyle : ''}`}
      aria-label="Club Match"
      onClick={handleClick}
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      LinkComponent={Link}
      {...hrefConditionalProp}
      variant="contained"
      className={`h-10 px-5 py-2 whitespace-nowrap normal-case ${shadow ? shadowStyle : ''}`}
      startIcon={icon}
      onClick={handleClick}
      disableElevation
    >
      Club Match
    </Button>
  );
}
