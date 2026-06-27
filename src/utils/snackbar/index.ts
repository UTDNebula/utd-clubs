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
export { SnackbarProvider } from './provider';
export { setSnackbar, setSnackbarWithPreset, closeSnackbar } from './global';
export { default as 'SnackbarPresets' } from './presets';
export { default as 'SSRSnackbarWrapper' } from './SSRSnackbarWrapper';
export type { SnackbarType } from './types';
