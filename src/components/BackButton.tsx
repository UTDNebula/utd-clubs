'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BackButtonProps = IconButtonProps & {
  href?: string;
};

const BackButton = ({ href, ...props }: BackButtonProps) => {
  const router = useRouter();

  const button = (
    <IconButton
      onClick={
        href
          ? undefined
          : () => {
              router.back();
            }
      }
      size="large"
      color="primary"
      {...props}
    >
      <ArrowBackIcon />
    </IconButton>
  );

  return (
    <div className="flex h-min flex-row align-middle">
      {href ? <Link href={href}>{button}</Link> : button}
    </div>
  );
};

export default BackButton;
