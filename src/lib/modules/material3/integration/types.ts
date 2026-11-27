import { M3Theme } from '../theme/types';

/**
 * Maps the values of a Material 3 theme to a theme from another library.
 * @param m3Theme Source Material 3 theme.
 * @returns Translated theme.
 */
export type M3Translator<
  TranslatedTheme,
  TranslatorOptions extends Record<string, unknown> = never,
> = (m3Theme: M3Theme, options?: TranslatorOptions) => TranslatedTheme;
