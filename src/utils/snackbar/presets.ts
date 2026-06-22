import { SnackbarType } from './types';

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

/**
 * Snackbar presets that can be used as an input for `setSnackbar()`. Modify this file to add other snackbar presets.
 *
 * Presets can also be functions that work as templates. These functions return a Snackbar object and accept any number of arguments.
 *
 * @example <caption>Basic usage (using object)</caption>
 * setSnackbar(SnackbarPresets.saved)
 *
 * @example <caption>Using a function template</caption>
 * setSnackbar(SnackbarPresets.savedName("form"))
 *
 * @example <caption>Using helper function and preset template</caption>
 * setSnackbarWithPreset("savedName", "form")
 *
 */
const SnackbarPresets = {
  success: (message: string) => ({
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
    message: 'An error occurred',
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  },
  errorWithMessage: (message: string) => ({
    title: 'An error occurred',
    message: message,
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  }),
  errorCustomWithMessage: (title: string, message: string) => ({
    title: title,
    message: message,
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  }),
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
  saveFailed: {
    message: 'Failed to save!',
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  },
  saveFailedWithMessage: (message: string) => ({
    title: `Failed to save!`,
    message: message,
    type: 'error',
    autoHideDuration: false,
    showClose: true,
  }),
} satisfies Record<string, SnackbarType | ((...args: never[]) => SnackbarType)>;

export default SnackbarPresets;
