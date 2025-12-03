'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();
  return (
    <IconButton
      onClick={() => router.back()}
      size="large"
      className={className}
      color="primary"
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default BackButton;
