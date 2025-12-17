'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { authClient } from '@src/utils/auth-client';
import { useRegisterModal } from '../account/RegisterModalProvider';

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
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        setShowRegisterModal(true);
      }
    : undefined;

  return (
    <Link href={session ? '/club-match/results' : '#'} onClick={handleClick}>
      {iconOnly ? (
        <IconButton
          size="large"
          className={`rounded-full bg-royal text-white ${shadow ? shadowStyle : ''}`}
        >
          {icon}
        </IconButton>
      ) : (
        <Button
          variant="contained"
          className={`rounded-full normal-case whitespace-nowrap ${shadow ? shadowStyle : ''}`}
          startIcon={icon}
        >
          Club Match
        </Button>
      )}
    </Link>
  );
}
