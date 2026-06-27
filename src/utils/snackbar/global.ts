'use client';

import { useEffect } from 'react';
import {
  closeSnackbarFn,
  setSnackbarFn,
  setSnackbarWithPresetFn,
  SnackbarFunctions,
} from './types';

const globalContextFunctionsDefault = () => {
  console.warn('Global snackbar functions not initialized');
};

const globalContextFunctionsUnmounted = () => {
  console.warn('Snackbar provider unmounted');
};

/**
 * Mutable global snackbar functions
 */
const globalSnackbarFunctions: SnackbarFunctions = {
  setSnackbar: globalContextFunctionsDefault,
  closeSnackbar: globalContextFunctionsDefault,
  setSnackbarWithPreset: globalContextFunctionsDefault,
};

/**
 * Sets the global snackbar to the options defined in the function argument.
 *
 * Does not require calling the {@linkcode useSnackbar} hook
 *
 * @example <caption>Basic usage</caption>
 * setSnackbar("Lorem ipsum dolor sit amet");
 */
export const setSnackbar: setSnackbarFn = (...args) =>
  globalSnackbarFunctions.setSnackbar(...args);

/**
 * Sets the global snackbar to a preset, along with any additional preset template parameters.
 *
 * Does not require calling the {@linkcode useSnackbar} hook
 *
 * @example <caption>Basic usage (with preset template parameter)</caption>
 * setSnackbarWithPreset("savedName", "lorem ipsum dolor sit amet");
 */
export const setSnackbarWithPreset: setSnackbarWithPresetFn = (
  preset,
  ...args
) => globalSnackbarFunctions.setSnackbarWithPreset(preset, ...args);

/**
 * Closes the global snackbar. Can filter for a particular snackbar ID.
 *
 * Does not require calling the {@linkcode useSnackbar} hook
 *
 * @example <caption>Basic usage (with snackbar ID filter)</caption>
 * closeSnackbar("loginMessage");
 */
export const closeSnackbar: closeSnackbarFn = (...args) =>
  globalSnackbarFunctions.closeSnackbar(...args);

/**
 * Internal hook to attach the snackbar provider's functions to the global exported functions.
 */
export function useAttachGlobalSnackbarFunctions(functions: SnackbarFunctions) {
  useEffect(() => {
    globalSnackbarFunctions.setSnackbar = functions.setSnackbar;
    globalSnackbarFunctions.setSnackbarWithPreset =
      functions.setSnackbarWithPreset;
    globalSnackbarFunctions.closeSnackbar = functions.closeSnackbar;

    return () => {
      globalSnackbarFunctions.setSnackbar = globalContextFunctionsUnmounted;
      globalSnackbarFunctions.setSnackbarWithPreset =
        globalContextFunctionsUnmounted;
      globalSnackbarFunctions.closeSnackbar = globalContextFunctionsUnmounted;
    };
  });
}
