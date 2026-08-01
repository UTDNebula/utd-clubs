import {
  Material3CompTokens,
  Material3RefPaletteTokens,
  Material3SysColorTokens,
  Material3SysDynamicColorTokens,
  Material3SysFixedColorTokens,
  Material3TokenClasses,
} from './types';

/**
 * A static object of tokens representing a particular variant of a Material 3 theme.
 */
export type Material3Theme = Material3TokenClasses;

////////////////////////////////////////////////////////////////////////////////
// Palette
////////////////////////////////////////////////////////////////////////////////

/**
 * Helper function to create Material 3 reference palette tokens.
 */
export const createPalette = <
  TParentPalette extends Material3RefPaletteTokens | undefined = undefined,
>(
  /** Object of reference palette tokens. */
  palette: TParentPalette extends Material3RefPaletteTokens
    ? Partial<Material3RefPaletteTokens>
    : Material3RefPaletteTokens,
  /** Pre-filled palette to extend, if you don't wish to provide values for every token. */
  parentPalette?: TParentPalette,
): Material3RefPaletteTokens => {
  if (parentPalette) {
    return { ...parentPalette, ...palette };
  } else {
    // ParentPalette is undefined, so palette is not partial
    return palette as Material3RefPaletteTokens;
  }
};

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

export type DynamicMaterial3ThemeValues = {
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

export type DynamicMaterial3ThemeVariants = {
  /**
   * Whether to return values corresponding to the light or dark color scheme
   * @default "light"
   */
  colorScheme: ColorScheme;
};

export type DynamicMaterial3ThemeOptions<GetValues extends boolean> = {
  /**
   * Returns the values used when constructing the theme
   * @default false
   */
  getValues?: GetValues;
};

/**
 * A function that returns a static object of tokens depending on the variant (e.g. light or dark mode) it is called with.
 */
export type DynamicMaterial3Theme = {
  // options.getValue == false (default)
  <GetValues extends false = false>(
    variant: DynamicMaterial3ThemeVariants | ColorScheme,
    options?: DynamicMaterial3ThemeOptions<GetValues>,
  ): Material3Theme;

  // options.getValue == true
  <GetValues extends true>(
    variant: DynamicMaterial3ThemeVariants | ColorScheme,
    options: DynamicMaterial3ThemeOptions<GetValues>,
  ): DynamicMaterial3ThemeValues;
};

export function createDynamicMaterial3Theme(
  values: DynamicMaterial3ThemeValues,
): DynamicMaterial3Theme {
  const colorSchemeValues: ColorSchemeValues =
    typeof values.sys.colorScheme === 'function'
      ? values.sys.colorScheme(values.ref.palette)
      : values.sys.colorScheme;

  // Declaration: options.getValue == false (default)
  function themeFn(
    variant: DynamicMaterial3ThemeVariants | ColorScheme,
    options?: DynamicMaterial3ThemeOptions<false>,
  ): Material3Theme;

  // Declaration: options.getValue == true
  function themeFn(
    variant: DynamicMaterial3ThemeVariants | ColorScheme,
    options: DynamicMaterial3ThemeOptions<true>,
  ): DynamicMaterial3ThemeValues;

  // Definition
  function themeFn(
    variantParameter: DynamicMaterial3ThemeVariants | ColorScheme,
    options?: DynamicMaterial3ThemeOptions<boolean>,
  ): DynamicMaterial3ThemeValues | Material3Theme {
    if (options?.getValues) {
      return values;
    }

    const variant: DynamicMaterial3ThemeVariants =
      typeof variantParameter === 'string'
        ? { colorScheme: variantParameter }
        : variantParameter;

    return {
      ref: values.ref ?? { palette: {} },
      sys: {
        color: colorSchemeValues.fixed
          ? {
              ...(variant.colorScheme === 'light'
                ? colorSchemeValues.light
                : variant.colorScheme === 'dark'
                  ? colorSchemeValues.dark
                  : colorSchemeValues.light),
              ...colorSchemeValues.fixed,
            }
          : {
              ...(variant.colorScheme === 'light'
                ? colorSchemeValues.light
                : variant.colorScheme === 'dark'
                  ? colorSchemeValues.dark
                  : colorSchemeValues.light),
            },
      },
      comp: values.comp,
    };
  }

  return themeFn;
}
