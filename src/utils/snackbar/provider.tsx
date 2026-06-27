'use client';

import CloseIcon from '@mui/icons-material/Close';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { SnackbarContext, SnackbarContextDefault } from './context';
import { useAttachGlobalSnackbarFunctions } from './global';
import SnackbarPresets, { SnackbarDefault } from './presets';
import {
  closeSnackbarFn,
  setSnackbarFn,
  setSnackbarWithPresetFn,
  SnackbarType,
} from './types';

/**
 * Provider component that provides snackbar context to its children and mounts the actual global snackbar components.
 */
export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  // Timeout timer that resets anytime `setSnackbar()` is called, to ensure users are able to read consecutive snackbars before it closes
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const [open, setOpen] = useState(false);

  const [snackbar, setSnackbarState] = useState<SnackbarType>(
    SnackbarContextDefault['snackbar'],
  );

  const [snackbarKey, setSnackbarKey] = useState('');

  const setSnackbar: setSnackbarFn = (arg) => {
    let newSnackbarState: SnackbarType = SnackbarDefault;

    if (typeof arg === 'string') {
      newSnackbarState = { ...newSnackbarState, message: arg };
    } else {
      newSnackbarState = {
        ...newSnackbarState,
        ...arg,
        closeOn: {
          ...newSnackbarState.closeOn,
          ...arg.closeOn,
        } as SnackbarType['closeOn'],
      };
    }

    if (!newSnackbarState.updateCurrent) {
      setSnackbarKey(new Date().getTime().toString());
    }

    setSnackbarState({ ...newSnackbarState });
    setOpen(true);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    return newSnackbarState;
  };

  const setSnackbarWithPreset: setSnackbarWithPresetFn = (preset, ...args) => {
    const presetData = SnackbarPresets[preset];

    let snackbarData: SnackbarType = {
      message: 'Unknown snackbar preset',
      type: 'error',
    };

    if (typeof presetData === 'function') {
      snackbarData = (presetData as (...args: unknown[]) => SnackbarType)(
        ...args,
      );
    } else {
      snackbarData = presetData;
    }
    return setSnackbar(snackbarData);
  };

  const closeSnackbar: closeSnackbarFn = (id) => {
    if (typeof id === 'undefined' || snackbar.id === id) {
      setOpen(false);
    }
  };

  // Sync global snackbar functions with local component functions
  useAttachGlobalSnackbarFunctions({
    setSnackbar,
    setSnackbarWithPreset,
    closeSnackbar,
  });

  const handleClose = useCallback(
    (reason?: SnackbarCloseReason | 'dismiss' | 'close') => {
      if (reason && reason !== 'close' && !snackbar.closeOn?.[reason]) return;

      setOpen(false);
    },
    [snackbar.closeOn],
  );

  // Handles closing of snackbar after a duration
  useEffect(() => {
    if (snackbar.autoHideDuration) {
      timeoutIdRef.current = setTimeout(
        () => {
          handleClose('timeout');
        },
        snackbar.autoHideDuration === true ? 6000 : snackbar.autoHideDuration,
      );
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [handleClose, snackbar.autoHideDuration]);

  return (
    <SnackbarContext.Provider
      value={{ snackbar, setSnackbar, closeSnackbar, setSnackbarWithPreset }}
    >
      {children}
      <Snackbar
        open={open}
        key={`${snackbar.id ?? 'unknown'}-${snackbarKey}`}
        onClose={(_event, reason) => {
          handleClose(reason);
        }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClick={() => {
          handleClose('dismiss');
        }}
        className={`${snackbar.closeOn?.dismiss ? 'cursor-pointer' : ''}`}
      >
        {snackbar.type === 'default' ? (
          <SnackbarContent
            message={
              <>
                {snackbar.title && <AlertTitle>{snackbar.title}</AlertTitle>}
                {snackbar.message}
              </>
            }
            action={
              <>
                {snackbar.action}
                {snackbar.showClose && (
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => handleClose('close')}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </>
            }
            className={snackbar.fitContent ? 'min-w-0' : ''}
          />
        ) : (
          <Alert
            onClose={
              snackbar.showClose ? () => handleClose('close') : undefined
            }
            severity={snackbar.type}
            variant="filled"
            action={snackbar.action}
            className={snackbar.fitContent ? '' : 'min-w-72'}
          >
            {snackbar.title && (
              <AlertTitle>
                {snackbar.title !== true
                  ? snackbar.title
                  : snackbar.type
                    ? getSnackbarTitle(snackbar.type)
                    : ''}
              </AlertTitle>
            )}
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

function getSnackbarTitle(severity: AlertColor) {
  const titleStrings: Record<AlertColor, string> = {
    success: 'Success',
    info: 'Info',
    warning: 'Warning',
    error: 'Error',
  };

  return titleStrings[severity];
}
