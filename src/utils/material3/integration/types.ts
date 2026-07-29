import { DynamicMaterial3Theme } from '../theme';

/**
 * Maps the values of a Material 3 theme to a theme from another library.
 * @param m3Theme Source Material 3 theme.
 * @returns Translated theme.
 */
export type M3Translator<TranslatedTheme> = (
  m3Theme: DynamicMaterial3Theme,
) => TranslatedTheme;
