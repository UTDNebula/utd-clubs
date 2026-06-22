'use client';

import { createContext, useContext } from 'react';
import { SnackbarDefault } from './presets';
import { SnackbarFunctions, SnackbarType } from './types';

/*
 * Snackbar Context
 */

export interface SnackbarContextType extends SnackbarFunctions {
  snackbar: SnackbarType;
}

export const SnackbarContextDefault: SnackbarContextType = {
  snackbar: SnackbarDefault,
  setSnackbar: () => {
    console.warn('Snackbar context not initialized');
  },
  closeSnackbar: () => {
    console.warn('Snackbar context not initialized');
  },
};

export const SnackbarContext = createContext<SnackbarContextType>(
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
export { SnackbarDefault };
