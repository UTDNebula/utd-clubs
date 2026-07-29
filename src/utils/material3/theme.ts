import {
  Material3CompTokens,
  Material3RefPaletteTokens,
  Material3SysColorTokens,
  Material3SysDynamicColorTokens,
  Material3SysFixedColorTokens,
  Material3TokenClasses,
} from './types';

export type ColorScheme = 'light' | 'dark';

/**
 * A static object of tokens representing a particular variant of a Material 3 theme.
 */
export type Material3Theme = Material3TokenClasses;

export type DynamicMaterial3ThemeColorSchemeValues =
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
       * {@linkcode DynamicMaterial3ThemeColorSchemeValues.light | light}
       * and {@linkcode DynamicMaterial3ThemeColorSchemeValues.dark | dark}
       */
      fixed: Material3SysFixedColorTokens;
    };

export type DynamicMaterial3ThemeValues = {
  ref: {
    palette: Material3RefPaletteTokens;
  };
  sys: {
    colorScheme: DynamicMaterial3ThemeColorSchemeValues;
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
        color: values.sys.colorScheme.fixed
          ? {
              ...(variant.colorScheme === 'light'
                ? values.sys.colorScheme.light
                : variant.colorScheme === 'dark'
                  ? values.sys.colorScheme.dark
                  : values.sys.colorScheme.light),
              ...values.sys.colorScheme.fixed,
            }
          : {
              ...(variant.colorScheme === 'light'
                ? values.sys.colorScheme.light
                : variant.colorScheme === 'dark'
                  ? values.sys.colorScheme.dark
                  : values.sys.colorScheme.light),
            },
      },
      comp: values.comp,
    };
  }

  return themeFn;
}
