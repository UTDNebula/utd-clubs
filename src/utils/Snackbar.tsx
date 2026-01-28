'use client';

import CloseIcon from '@mui/icons-material/Close';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type Snackbar = {
  open?: boolean;
  /**
   * Message displayed in snackbar
   */
  message: ReactNode;
  /**
   * Title displayed at top of message
   *
   * If set to `true` and `type` is not "default", title will be a default title that corresponds to `type`
   *
   * @default false
   */
  title?: boolean | ReactNode;
  /**
   * Severity style of snackbar
   * @default "default"
   */
  type?: AlertColor | 'default';
  /**
   * Number of milliseconds to wait until snackbar is automatically dismissed. When calling `setSnackbar` again, this countdown will reset.
   * If `null`, snackbar will not automatically dismiss.
   * If `true`, will use default value of `6000`
   * @default null
   */
  autoHideDuration?: number | boolean | null;
  /**
   * Specifies what reasons the snackbar is allowed to close on.
   * - `"timeout"` - Close when `autoHideDuration` elapses
   * - `"clickaway"` - Close when user clicks outside of the snackbar
   * - `"escapeKeyDown"` - Close when user presses the escape key
   * - `"dismiss"` - Close when user clicks the snackbar
   * @default
   * ["timeout", "escapeKeyDown"]
   */
  closeOn?: (SnackbarCloseReason | 'dismiss')[];
  /**
   * Whether to show the close button on the snackbar.
   *
   * **IMPORTANT:** If `type` is not "default" and `action` is provided, then this will not display
   *
   * @default false
   */
  showClose?: boolean;
  /**
   * Components that will be rendered at the right of the snackbar
   */
  action?: ReactNode;
  /**
   * Whether the width of the snackbar should fit its content
   * @default false
   */
  fitContent?: boolean;
};

const SnackbarDefault: Snackbar = {
  message: '',
  title: false,
  open: false,
  type: 'default',
  autoHideDuration: null,
  closeOn: ['timeout', 'escapeKeyDown'],
  showClose: false,
  action: undefined,
  fitContent: false,
};

interface SnackbarProviderContext {
  snackbar: Snackbar;
  setSnackbar: (snackbar: string | Omit<Snackbar, 'open'>) => void;
}

const SnackbarContextDefault: SnackbarProviderContext = {
  snackbar: SnackbarDefault,
  setSnackbar: () => {},
};

export const SnackbarContext = createContext<SnackbarProviderContext>(
  SnackbarContextDefault,
);

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  // Timeout timer that resets anytime `setSnackbar()` is called, to ensure users are able to read consecutive snackbars before it closes
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const [snackbar, setSnackbarState] = useState<Snackbar>(
    SnackbarContextDefault['snackbar'],
  );

  const setSnackbar: SnackbarProviderContext['setSnackbar'] = (arg) => {
    let newSnackbarState: Snackbar = SnackbarDefault;

    if (typeof arg === 'string') {
      newSnackbarState = { ...newSnackbarState, message: arg };
    } else {
      newSnackbarState = { ...newSnackbarState, ...arg };
    }

    setSnackbarState({ ...newSnackbarState, open: true });

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const handleClose = useCallback(
    (reason?: SnackbarCloseReason | 'dismiss' | 'close') => {
      console.log('reason', reason);

      if (reason && reason !== 'close' && !snackbar.closeOn?.includes(reason))
        return;

      setSnackbarState((prevSnackbar) => ({
        ...prevSnackbar,
        open: false,
      }));
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
    <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        onClose={(_event, reason) => {
          handleClose(reason);
        }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClick={() => {
          handleClose('dismiss');
        }}
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
