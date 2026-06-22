import { createContext, useContext } from 'react';
import { setSnackbarFn, SnackbarType } from './types';

export const SnackbarDefault: SnackbarType = {
  message: '',
  title: false,
  type: 'default',
  autoHideDuration: null,
  closeOn: {
    clickaway: false,
    dismiss: false,
    escapeKeyDown: true,
    timeout: true,
  },
  showClose: false,
  action: undefined,
  fitContent: false,
};

/*
 * Snackbar Context
 */

export interface SnackbarProviderContext {
  snackbar: SnackbarType;
  setSnackbar: setSnackbarFn;
}

export const SnackbarContextDefault: SnackbarProviderContext = {
  snackbar: SnackbarDefault,
  setSnackbar: () => {},
};

export const SnackbarContext = createContext<SnackbarProviderContext>(
  SnackbarContextDefault,
);

/**
 * Hook that grants access to the snackbar system. Allows you to set and read the snackbar
 *
 * @example <caption>Basic usage</caption>
 * const { setSnackbar } = useSnackbar();
 * setSnackbar("Lorem ipsum dolor sit amet");
 *
 * @example <caption>Reading snackbar</caption>
 * const { snackbar, setSnackbar } = useSnackbar();
 * setSnackbar("foo bar");
 * console.log("snackbar.message") // Output: foo bar
 */
export const useSnackbar = () => useContext(SnackbarContext);
