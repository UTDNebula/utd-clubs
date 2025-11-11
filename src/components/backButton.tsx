'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';

type BackButtonProps = {
  href?: string;
};

export const BackButton = ({ href, ...props }: BackButtonProps) => {
  const router = useRouter();
  return (
    <div className="flex h-min flex-row align-middle">
      <IconButton
        onClick={() => {
          if (href) {
            router.push(href);
          } else {
            router.back();
          }
        }}
        size="large"
        color="primary"
        {...props}
      >
        <ArrowBackIcon />
      </IconButton>
    </div>
  );
};

export default BackButton;
