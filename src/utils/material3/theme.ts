import {
  Material3CompTokens,
  Material3RefPaletteTokens,
  Material3SysColorTokens,
  Material3SysFixedColorTokens,
  Material3TokenClasses,
} from './types';

type DynamicMaterial3ThemeColorSchemeValues = {
  light?: Material3SysColorTokens;
  dark?: Material3SysColorTokens;
  /**
   * Keys here will take precedence over those in
   * {@linkcode DynamicMaterial3ThemeColorSchemeValues.light | light}
   * and {@linkcode DynamicMaterial3ThemeColorSchemeValues.dark | dark}
   */
  fixed?: Material3SysFixedColorTokens;
};

export type DynamicMaterial3ThemeValues = {
  ref?: {
    palette?: Material3RefPaletteTokens;
  };
  sys?: {
    colorScheme?: DynamicMaterial3ThemeColorSchemeValues;
  };
  comp?: Material3CompTokens;
};

export type DynamicMaterial3ThemeOptions = {
  colorScheme: 'light' | 'dark';
};

export type DynamicMaterial3Theme = (
  options: DynamicMaterial3ThemeOptions,
) => Material3TokenClasses;

export function createDynamicMaterial3Theme(
  values: DynamicMaterial3ThemeValues,
): DynamicMaterial3Theme {
  return ({ colorScheme }) => ({
    ref: values.ref,
    sys: {
      color: {
        ...(colorScheme === 'light'
          ? values.sys?.colorScheme?.light
          : colorScheme === 'dark'
            ? values.sys?.colorScheme?.dark
            : {}),
        ...values.sys?.colorScheme?.fixed,
      },
    },
    comp: values.comp,
  });
}
