import { SnackbarType } from './types';

/**
 * Snackbar presets that can be used as an input for `setSnackbar()`. Modify this file to add other snackbar presets.
 *
 * Presets can also be functions that work as templates. These functions return a Snackbar object and accept any number of arguments.
 *
 * @example <caption>Basic usage</caption>
 * setSnackbar(SnackbarPresets.saved)
 *
 * @example <caption>Using a function template</caption>
 * setSnackbar(SnackbarPresets.savedName("form"))
 * // OR
 * setSnackbar(SnackbarPresets["savedName"]("form"))
 */
const SnackbarPresets = {
  saved: {
    message: 'Saved!',
    type: 'success',
    autoHideDuration: true,
    fitContent: true,
    closeOn: {
      clickaway: false,
      dismiss: true,
      escapeKeyDown: true,
      timeout: true,
    },
  },
  savedName: (name: string) => ({
    message: `Saved ${name}!`,
    type: 'success',
    autoHideDuration: true,
    fitContent: true,
    closeOn: {
      clickaway: false,
      dismiss: true,
      escapeKeyDown: true,
      timeout: true,
    },
  }),
  savedCustom: (message: string) => ({
    message: message,
    type: 'success',
    autoHideDuration: true,
    fitContent: true,
    closeOn: {
      clickaway: false,
      dismiss: true,
      escapeKeyDown: true,
      timeout: true,
    },
  }),
  error: {
    message: 'Failed to save!',
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  },
  errorMessage: (message: string) => ({
    title: `Failed to save!`,
    message: message,
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  }),
  errorCustomMessage: (title: string, message: string) => ({
    title: title,
    message: message,
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  }),
} satisfies Record<string, SnackbarType | ((...args: never[]) => SnackbarType)>;

export default SnackbarPresets;
