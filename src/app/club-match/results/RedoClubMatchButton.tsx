'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

const RedoClubMatchButton = () => {
  return (
    <Button
      variant="contained"
      component={Link}
      href="/club-match"
      className="rounded-full w-fit normal-case self-center"
    >
      Redo Club Match
    </Button>
  );
};

export default RedoClubMatchButton;
