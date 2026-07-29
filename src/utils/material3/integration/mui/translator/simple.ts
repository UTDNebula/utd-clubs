import { ThemeOptions } from '@mui/material';
import { M3Translator } from '../../types';

/**
 * Translates a Material 3 theme to a MUI theme by simply mapping the M3 palette to the MUI palette.
 * This means the translated theme is highly unlikely to match any formal design system.
 */
const simpleTranslateM3toMui: M3Translator<ThemeOptions> = function (m3Theme) {
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

export default simpleTranslateM3toMui;
