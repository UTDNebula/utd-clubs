'use client';

import DifferenceIcon from '@mui/icons-material/Difference';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';

const shadowStyle = 'drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]';

const icon = <DifferenceIcon fontSize="small" />;

export default function ClubMatchButton({
  shadow,
  iconOnly,
}: {
  shadow?: boolean;
  iconOnly?: boolean;
}) {
  if (iconOnly)
    return (
      <Link href="/club-match/results">
        <IconButton
          size="large"
          className={`rounded-full bg-royal text-white ${shadow ? shadowStyle : ''}`}
        >
          {icon}
        </IconButton>
      </Link>
    );
  return (
    <Link href="/club-match/results">
      <Button
        variant="contained"
        className={`rounded-full normal-case ${shadow ? shadowStyle : ''}`}
        startIcon={icon}
      >
        Club Match
      </Button>
    </Link>
  );
}
