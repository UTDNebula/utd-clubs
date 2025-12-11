'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BackButtonProps = IconButtonProps & {
  href?: string;
};

export const BackButton = ({ href, ...props }: BackButtonProps) => {
  const router = useRouter();

  const LinkIfHref = ({ children }: { children: React.ReactNode }) => {
    if (href) {
      return <Link href={href}>{children}</Link>;
    }
    return children;
  };

  return (
    <div className="flex h-min flex-row align-middle">
      <LinkIfHref>
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
      </LinkIfHref>
    </div>
  );
};

export default BackButton;
