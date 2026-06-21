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
      className={`dark:text-haiti h-10 w-10 rounded-full bg-[var(--mui-palette-primary-main)] text-white hover:bg-[var(--mui-palette-primary-dark)] ${shadow ? shadowStyle : ''}`}
      aria-label="Club Match"
    >
      {icon}
    </IconButton>
  ) : (
    <Button
      LinkComponent={Link}
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
