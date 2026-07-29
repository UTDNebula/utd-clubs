/**
 * @file Translates a Material 3 theme to a MUI theme with Material 3 color tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
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
 * Generates a MUI theme augmented with Material 3 tokens.
 * @param material3Theme Inserts this Material 3 theme into relevant MUI theme locations and other augmented locations.
 * @param options An incomplete MUI theme object for customizing the returned theme object.
 * @returns A complete, ready-to-use theme object.
 */
export function createMaterial3MuiTheme(
  material3Theme: DynamicMaterial3Theme,
  options: ThemeOptions,
) {
  const translatedMaterial3MuiThemeOptions: ThemeOptions = {
    cssVariables: true,
    colorSchemes: {
      light: {
        palette: {
          ref: material3Theme('light').ref.palette,
          sys: material3Theme('light').sys.color,
          comp: material3Theme('light').comp,
        },
      },
      dark: {
        palette: {
          ref: material3Theme('dark').ref.palette,
          sys: material3Theme('dark').sys.color,
          comp: material3Theme('dark').comp,
        },
      },
    },
    palette: {
      ref: material3Theme('light', { getValues: true }).ref.palette,
    },
  };

  return createTheme(deepmerge(translatedMaterial3MuiThemeOptions, options));
}
