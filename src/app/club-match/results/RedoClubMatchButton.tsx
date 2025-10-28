'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

const RedoClubMatchButton = () => {
  return (
    <Button
      variant="contained"
      component={Link}
      href="/club-match"
      className="w-fit normal-case"
    >
      Redo club match
    </Button>
  );
};

export default RedoClubMatchButton;
