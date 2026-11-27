import {
  ColorScheme,
  ColorSchemeValues,
  M3Theme,
  M3ThemeOptions,
  M3ThemeValues,
  M3ThemeVariants,
  StaticM3Theme,
} from './types';

export function createM3Theme(values: M3ThemeValues): M3Theme {
  const colorSchemeValues: ColorSchemeValues =
    typeof values.sys.colorScheme === 'function'
      ? values.sys.colorScheme(values.ref.palette)
      : values.sys.colorScheme;

  // Declaration: options.getValue == false (default)
  function themeFn(
    variant: M3ThemeVariants | ColorScheme,
    options?: M3ThemeOptions<false>,
  ): StaticM3Theme;

  // Declaration: options.getValue == true
  function themeFn(
    variant: M3ThemeVariants | ColorScheme,
    options: M3ThemeOptions<true>,
  ): M3ThemeValues;

  // Definition
  function themeFn(
    variantParameter: M3ThemeVariants | ColorScheme,
    options?: M3ThemeOptions<boolean>,
  ): M3ThemeValues | StaticM3Theme {
    if (options?.getValues) {
      return values;
    }

    const variant: M3ThemeVariants =
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
