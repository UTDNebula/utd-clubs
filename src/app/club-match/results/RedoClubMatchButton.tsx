'use client';

import { RestartAlt } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';

const RedoClubMatchButton = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="contained"
      onClick={() => setLoading(true)}
      href="/club-match"
      loading={loading}
      loadingPosition="start"
      className="rounded-full w-fit normal-case self-center"
      startIcon={<RestartAlt />}
    >
      {loading ? 'Loading...' : 'Redo Club Match'}
    </Button>
  );
};

export default RedoClubMatchButton;
