'use client';

import { ReactNode, useEffect } from 'react';
import { setParams } from '@/lib/utils/searchParams';
import { useSnackbar } from './context';
import { SnackbarType } from './types';

export type SSRSnackbarWrapperProps = {
  /**
   * The snackbar to display when loaded.
   */
  snackbar: string | SnackbarType;
  /**
   * Whether to prevent the snackbar from displaying when loaded.
   */
  disabled?: boolean;
  /**
   * Key(s) to be removed from search params on the client once the page loads. Affected by the {@linkcode SSRSnackbarWrapperProps.disabled | disabled} prop.
   */
  deleteSearchParamKey?: string | string[];
  children?: ReactNode;
};

/**
 * Utility wrapper component that allows SSR'ed components to display a snackbar to the client as soon as the page loads.
 */
export default function SSRSnackbarWrapper({
  snackbar,
  disabled,
  deleteSearchParamKey,
  children,
}: SSRSnackbarWrapperProps) {
  const { setSnackbar } = useSnackbar();

  useEffect(() => {
    if (!disabled) {
      setSnackbar(snackbar);

      const params = new URLSearchParams(window.location.search);

      if (typeof deleteSearchParamKey === 'string') {
        // Only run setParams if key exists (prevent redirect loop)
        if (params.has(deleteSearchParamKey)) {
          setParams((params) => {
            params.delete(deleteSearchParamKey);
          });
        }
      } else {
        // Only run setParams if at least one key exists (prevent redirect loop)
        if (deleteSearchParamKey?.some((key) => params.has(key))) {
          setParams((params) => {
            deleteSearchParamKey?.forEach((key) => {
              params.delete(key);
            });
          });
        }
      }
    }

    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
