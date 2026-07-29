/**
 * @file Translates a Material 3 theme to a MUI theme with Material 3 color tokens
 */

import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { DynamicMaterial3Theme } from './theme';
import {
  Material3CompTokens,
  Material3RefPaletteTokens,
  Material3SysColorTokens,
} from './types';

declare module '@mui/material/styles' {
  interface Palette {
    ref: Material3RefPaletteTokens;
    sys: Material3SysColorTokens;
    comp: Material3CompTokens;
  }
  interface PaletteOptions {
    ref?: Partial<Material3RefPaletteTokens>;
    sys?: Partial<Material3SysColorTokens>;
    comp?: Partial<Material3CompTokens>;
  }
}

/**
 * Maps the values of a Material 3 theme to a MUI theme.
 * @param m3Theme Source Material 3 theme.
 * @returns Translated MUI theme.
 */
export type M3toMuiTranslator = (
  m3Theme: DynamicMaterial3Theme,
) => ThemeOptions;

/**
 * Default function to translate a Material 3 theme to a MUI theme.
 *
 * @see
 * An approximate reversal of https://m3.material.io/blog/migrating-material-3
 */
export const translateM3toMui: M3toMuiTranslator = function (m3Theme) {
  const lightTheme = m3Theme('light');
  const darkTheme = m3Theme('dark');
  // Variant doesn't matter when using getValues
  const themeValues = m3Theme('light', { getValues: true });

  return {
    palette: {
      primary: {
        main: themeValues.ref.palette.primary40,
      },
    },
  };
};

/**
 * Generates a MUI theme augmented with Material 3 tokens.
 * @param m3Theme Translates this Material 3 theme to a MUI theme by translating to appropriate locations and inserting into augmented locations.
 * @param optionOverrides An incomplete MUI theme object for customizing the returned theme object.
 * @returns A complete, ready-to-use theme object.
 */
export function createMuiThemeWithM3(
  m3Theme: DynamicMaterial3Theme,
  optionOverrides?: ThemeOptions,
  options?: {
    /**
     * Whether to insert the Material 3 theme's tokens into appropriate locations in the MUI theme.
     * @default true
     */
    translate?: boolean;
    /**
     * Function used to translate the Material 3 theme to the MUI theme. If omitted, uses the default translator function ({@linkcode translateM3toMui})
     */
    translateFn?: M3toMuiTranslator;
  },
): Theme {
  const lightTheme = m3Theme('light');
  const darkTheme = m3Theme('dark');
  // Variant doesn't matter when using getValues
  const themeValues = m3Theme('light', { getValues: true });

  const augmentedOptions: ThemeOptions = {
    cssVariables: true,
    colorSchemes: {
      light: {
        palette: {
          ref: lightTheme.ref.palette,
          sys: lightTheme.sys.color,
          comp: lightTheme.comp,
        },
      },
      dark: {
        palette: {
          ref: darkTheme.ref.palette,
          sys: darkTheme.sys.color,
          comp: darkTheme.comp,
        },
      },
    },
    palette: {
      ref: themeValues.ref.palette,
      sys: lightTheme.sys.color,
      comp: lightTheme.comp,
    },
  };

  const translateFn = options?.translateFn ?? translateM3toMui;

  const translatedOptions: ThemeOptions =
    (options?.translate ?? true)
      ? deepmerge(augmentedOptions, translateFn(m3Theme))
      : augmentedOptions;

  return createTheme(deepmerge(translatedOptions, optionOverrides));
}
