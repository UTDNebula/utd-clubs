import {
  AlertColor,
  SnackbarCloseReason,
} from 'node_modules/@mui/material/index.mjs';
import { ReactNode } from 'node_modules/@types/react';
import SnackbarPresets from './presets';

export interface SnackbarType {
  /**
   * Identifier for the snackbar. Allows filtering for snackbars with this ID when calling {@linkcode closeSnackbarFn | closeSnackbar}
   */
  id?: string;
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
   * {
   *   clickaway: false,
   *   dismiss: false,
   *   escapeKeyDown: true,
   *   timeout: true,
   * }
   */
  closeOn?: Record<SnackbarCloseReason | 'dismiss', boolean>;
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
  /**
   * If true, will immediately update the current snackbar without triggering an animation
   * @default false
   */
  updateCurrent?: boolean;
}

export type setSnackbarFn = (
  snackbar: string | SnackbarType,
) => SnackbarType | void;

type SnackbarPresets = typeof SnackbarPresets;

export type setSnackbarWithPresetFn = <Preset extends keyof SnackbarPresets>(
  preset: Preset,
  ...args: SnackbarPresets[Preset] extends (...args: infer Args) => unknown
    ? Args
    : []
) => void;

export type closeSnackbarFn = (id?: string) => SnackbarType | void;

export interface SnackbarFunctions {
  setSnackbar: setSnackbarFn;
  setSnackbarWithPreset: setSnackbarWithPresetFn;
  closeSnackbar: closeSnackbarFn;
}
