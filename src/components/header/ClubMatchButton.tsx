'use client';

import Link from 'next/link';
import { Button } from '@mui/material';

export default function ClubMatchButton() {
  return (
    <Button
      variant="contained"
      component={Link}
      href="/club-match/results"
      className="normal-case drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
    >
      Club Match
    </Button>
  );
}
