/**
 * @file Provides a unified snackbar system for the entire codebase.
 *
 * To use, call {@linkcode setSnackbar} from any component that is a child of {@linkcode SnackbarProvider}
 *
 * @example <caption>Basic usage (using hook)</caption>
 * const { setSnackbar } = useSnackbar();
 * setSnackbar("Lorem ipsum dolor sit amet");
 *
 * @example <caption>Using global function</caption>
 * setSnackbar("Lorem ipsum dolor sit amet");
 */

export { useSnackbar } from './context';
export {
  setSnackbar,
  setSnackbarWithPreset,
  closeSnackbar,
  SnackbarProvider,
} from './provider';
export { default as 'SnackbarPresets' } from './presets';
