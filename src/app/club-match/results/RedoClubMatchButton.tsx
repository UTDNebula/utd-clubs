'use client';

import { Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RedoClubMatchButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push('/club-match');
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      disabled={loading}
      className="rounded-full w-fit normal-case self-center"
      startIcon={
        loading ? <CircularProgress size={18} color="inherit" /> : null
      }
    >
      {loading ? 'Loading...' : 'Redo Club Match'}
    </Button>
  );
};

export default RedoClubMatchButton;
