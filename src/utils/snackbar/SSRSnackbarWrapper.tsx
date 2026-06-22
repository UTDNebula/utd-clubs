'use client';

import { ReactNode, useEffect } from 'react';
import { SnackbarType } from './types';
import { useSnackbar } from './context';

export type SSRSnackbarWrapperProps = {
  /**
   * Whether to prevent the snackbar from displaying when loaded.
   */
  disabled?: boolean;
  /**
   * The snackbar to display when loaded
   */
  snackbar: string | SnackbarType;
  children?: ReactNode;
};

/**
 * Utility wrapper component that allows SSR'ed components to display a snackbar to the client as soon as the page loads
 */
export default function SSRSnackbarWrapper({
  disabled,
  snackbar,
  children,
}: SSRSnackbarWrapperProps) {
  const { setSnackbar } = useSnackbar();

  useEffect(() => {
    if (!disabled) {
      setSnackbar(snackbar);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
