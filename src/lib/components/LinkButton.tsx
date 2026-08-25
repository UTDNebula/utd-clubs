'use client';

import { Button, ButtonProps } from '@mui/material';
import Link from 'next/link';

interface LinkButtonProps extends ButtonProps {
  target?: string;
  // add custom props here if needed
}

export function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <Button LinkComponent={Link} {...props}>
      {children}
    </Button>
  );
}
