'use client';

import { createContext, useContext } from 'react';
import { SnackbarDefault } from './presets';
import { SnackbarFunctions, SnackbarType } from './types';

export interface SnackbarContextType extends SnackbarFunctions {
  /**
   * Current state of the snackbar.
   */
  snackbar: SnackbarType;
}

const SnackbarContextFunctionsDefault = () => {
  console.warn('Snackbar context not initialized');
};

export const SnackbarContextDefault: SnackbarContextType = {
  snackbar: SnackbarDefault,
  setSnackbar: SnackbarContextFunctionsDefault,
  setSnackbarWithPreset: SnackbarContextFunctionsDefault,
  closeSnackbar: SnackbarContextFunctionsDefault,
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
 * console.log(snackbar.message) // Output: foo bar
 */
export const useSnackbar = () => useContext(SnackbarContext);
