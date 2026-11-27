import { Material3CompTokens, Material3TokenClasses } from '../tokens';
import { Material3RefPaletteTokens } from '../tokens/ref';
import {
  Material3SysColorTokens,
  Material3SysDynamicColorTokens,
  Material3SysFixedColorTokens,
} from '../tokens/sys';

/**
 * A static object of tokens representing a particular variant of a Material 3 theme.
 */
export type StaticM3Theme = Material3TokenClasses;

////////////////////////////////////////////////////////////////////////////////
// Color Scheme
////////////////////////////////////////////////////////////////////////////////

export type ColorScheme = 'light' | 'dark';

export type ColorSchemeValues =
  | {
      /** Value of the system color tokens in light mode. */
      light: Material3SysColorTokens;
      /** Value of the system color tokens in dark mode. */
      dark: Material3SysColorTokens;
      fixed?: never;
    }
  | {
      /** Value of the system color tokens in light mode. */
      light: Material3SysDynamicColorTokens &
        Partial<Material3SysFixedColorTokens>;
      /** Value of the system color tokens in dark mode. */
      dark: Material3SysDynamicColorTokens &
        Partial<Material3SysFixedColorTokens>;
      /**
       * Keys here will take precedence over those in
       * {@linkcode ColorSchemeValues.light | light}
       * and {@linkcode ColorSchemeValues.dark | dark}
       */
      fixed: Material3SysFixedColorTokens;
    };

/**
 * Maps the values of reference palette tokens to system color tokens.
 * @param palette Palette of reference tokens.
 * @returns The color tokens for light mode, dark mode, and fixed color tokens.
 */
export type PaletteMapper = (
  palette: Material3RefPaletteTokens,
) => ColorSchemeValues;

////////////////////////////////////////////////////////////////////////////////
// Dynamic Theme
////////////////////////////////////////////////////////////////////////////////

export type M3ThemeValues = {
  ref: {
    palette: Material3RefPaletteTokens;
  };
  sys: {
    /**
     * The system color tokens for light mode, dark mode, and fixed tokens.
     * Can either be an object with new values or a function that maps the
     * theme's reference palette tokens to this object.
     */
    colorScheme: ColorSchemeValues | PaletteMapper;
  };
  comp: Material3CompTokens;
};

export type M3ThemeVariants = {
  /**
   * Whether to return values corresponding to the light or dark color scheme
   * @default "light"
   */
  colorScheme: ColorScheme;
};

export type M3ThemeOptions<GetValues extends boolean> = {
  /**
   * Returns the values used when constructing the theme
   * @default false
   */
  getValues?: GetValues;
};

/**
 * A function that returns a static object of tokens depending on the variant (e.g. light or dark mode) it is called with.
 */
export type M3Theme = {
  // options.getValue == false (default)
  <GetValues extends false = false>(
    variant: M3ThemeVariants | ColorScheme,
    options?: M3ThemeOptions<GetValues>,
  ): StaticM3Theme;

  // options.getValue == true
  <GetValues extends true>(
    variant: M3ThemeVariants | ColorScheme,
    options: M3ThemeOptions<GetValues>,
  ): M3ThemeValues;
};
