'use client';

import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';

const shadowStyle = 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]';

const icon = <Diversity3Icon fontSize="small" />;

export default function ClubMatchButton({
  shadow,
  iconOnly,
}: {
  shadow?: boolean;
  iconOnly?: boolean;
}) {
  return iconOnly ? (
    <IconButton
      LinkComponent={Link}
      href="/club-match/results"
      size="large"
      className={`rounded-full w-10 h-10 bg-[var(--mui-palette-primary-main)] hover:bg-[var(--mui-palette-primary-dark)] text-white dark:text-haiti ${shadow ? shadowStyle : ''}`}
      aria-label="Club Match"
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      LinkComponent={Link}
      href="/club-match/results"
      variant="contained"
      className={`normal-case px-5 py-2 h-10 whitespace-nowrap ${shadow ? shadowStyle : ''}`}
      startIcon={icon}
      disableElevation
    >
      Club Match
    </Button>
  );
}
