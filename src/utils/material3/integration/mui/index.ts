/**
 * @file Translates a Material 3 theme to a MUI theme with Material 3 color tokens
 */

import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { ColorScheme, DynamicMaterial3Theme } from '../../theme';
import {
  Material3CompTokens,
  Material3RefPaletteTokens,
  Material3SysColorTokens,
} from '../../types';
import { M3Translator } from '../types';
import defaultTranslateM3toMui from './translator';

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
 * Generates a MUI theme augmented with Material 3 tokens.
 * @param m3Theme Translates this Material 3 theme to a MUI theme by translating to appropriate locations and inserting into augmented locations.
 * @param optionOverrides An incomplete MUI theme object for customizing the returned theme object.
 * @returns A complete, ready-to-use theme object.
 */
export function createThemeFromM3(
  m3Theme: DynamicMaterial3Theme,
  optionOverrides?: ThemeOptions,
  options?: {
    /**
     * Whether to insert the Material 3 theme's tokens into appropriate locations in the MUI theme.
     * @default true
     */
    translate?: boolean;
    /**
     * Function used to translate the Material 3 theme to the MUI theme. If omitted, uses the default translator function: {@linkcode defaultTranslateM3toMui}
     */
    translateFn?: M3Translator<ThemeOptions>;
    /**
     * Whether to augment MUI's legacy {@linkcode ThemeOptions.palette} field with Material 3 tokens.
     * - `false` Use MUI's newer {@linkcode ThemeOptions.colorSchemes} field (default)
     * - `"light"` or `true` Use M3 light mode tokens. Replaces `light` field of `colorSchemes`
     * - `"dark"` Use M3 dark mode tokens. Replaces `dark` field of `colorSchemes`
     *
     * @default false
     */
    augmentLegacyPalette?: boolean | ColorScheme;
  },
): Theme {
  const lightTheme = m3Theme('light');
  const darkTheme = m3Theme('dark');

  const augmentLegacyPaletteMode =
    typeof options?.augmentLegacyPalette === 'string'
      ? options?.augmentLegacyPalette
      : 'light';
  const augmentLegacyPaletteTheme =
    augmentLegacyPaletteMode === 'dark' ? darkTheme : lightTheme;

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
    palette: options?.augmentLegacyPalette
      ? {
          mode: augmentLegacyPaletteMode,
          ref: augmentLegacyPaletteTheme.ref.palette,
          sys: augmentLegacyPaletteTheme.sys.color,
          comp: augmentLegacyPaletteTheme.comp,
        }
      : undefined,
  };

  const translateFn = options?.translateFn ?? defaultTranslateM3toMui;

  const translatedOptions: ThemeOptions =
    (options?.translate ?? true)
      ? deepmerge(augmentedOptions, translateFn(m3Theme))
      : augmentedOptions;

  return createTheme(deepmerge(translatedOptions, optionOverrides));
}
