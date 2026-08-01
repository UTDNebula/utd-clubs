import { Color, ColorSystemOptions, ThemeOptions } from '@mui/material';
import { StaticM3Theme } from '../../../theme/types';
import { Material3RefPaletteTokens } from '../../../tokens/ref';
import { ColorString } from '../../../tokens/types';
import { M3Translator } from '../../types';
import { RemoveDigits, rgba } from '../../utils';

const mapMuiShades = <
  TPalette extends Material3RefPaletteTokens,
  TColor extends RemoveDigits<keyof TPalette & string>,
>(
  palette: TPalette,
  color: TColor,
): Partial<Color> => {
  const m3shades: Record<string, ColorString> = {};

  for (const key in palette) {
    if (key.toString().startsWith(color)) {
      const m3shade = key.match(/\d+$/)?.[0];
      if (m3shade) m3shades[m3shade] = palette[key] as ColorString;
    }
  }

  return {
    '50': m3shades['95'],
    '100': m3shades['90'],
    '200': m3shades['80'],
    '300': m3shades['70'],
    '400': m3shades['60'],
    '500': m3shades['50'],
    '600': m3shades['40'],
    '700': m3shades['30'],
    '800': m3shades['20'],
    '900': m3shades['10'],
    A100: m3shades['90'],
    A200: m3shades['80'],
    A400: m3shades['60'],
    A700: m3shades['30'],
  };
};

export type M3toMuiTranslatorOptions = {
  /**
   * Maps the shades of Material 3 theme's palette tokens to MUI's palette tokens.
   * @default false
   */
  mapPaletteShades?: boolean;
};

/**
 * Translates a Material 3 theme to a MUI theme by simply mapping the M3 palette to the MUI palette.
 * This means the translated theme is highly unlikely to match any formal design system.
 */
const simpleTranslateM3toMui: M3Translator<
  ThemeOptions,
  M3toMuiTranslatorOptions
> = function (m3Theme, options) {
  const { mapPaletteShades = false } = options ?? {};

  const mapShades: typeof mapMuiShades = (...args) =>
    mapPaletteShades ? mapMuiShades(...args) : {};

  const lightTheme = m3Theme('light');
  const darkTheme = m3Theme('dark');

  const getColorScheme = (theme: StaticM3Theme): ColorSystemOptions => ({
    palette: {
      common: {
        black: theme.ref.palette.black,
        white: theme.ref.palette.white,
        background: theme.sys.color.background,
        onBackground: theme.sys.color.onBackground,
      },
      primary: {
        main: theme.sys.color.primary,
        contrastText: theme.sys.color.onPrimary,
        ...mapShades(theme.ref.palette, 'primary'),
      },
      secondary: {
        main: theme.sys.color.secondary,
        contrastText: theme.sys.color.onSecondary,
        ...mapShades(theme.ref.palette, 'secondary'),
      },
      error: {
        main: theme.sys.color.error,
        contrastText: theme.sys.color.onError,
        ...mapShades(theme.ref.palette, 'error'),
      },
      info: {
        main: theme.sys.color.tertiary,
        contrastText: theme.sys.color.onTertiary,
        ...mapShades(theme.ref.palette, 'tertiary'),
      },
      grey: {
        ...mapShades(theme.ref.palette, 'neutral'),
        ...(mapPaletteShades
          ? {
              A100: theme.ref.palette.neutralVariant90,
              A200: theme.ref.palette.neutralVariant80,
              A400: theme.ref.palette.neutralVariant60,
              A700: theme.ref.palette.neutralVariant30,
            }
          : {}),
      },
      text: {
        primary: theme.sys.color.onSurface,
        secondary: theme.sys.color.onSurfaceVariant,
        disabled: rgba(theme.sys.color.onSurface, 0.38),
      },
      divider: theme.sys.color.outlineVariant,
      background: {
        default: theme.sys.color.background ?? theme.sys.color.surface,
        paper: theme.sys.color.surfaceContainerLow,
      },
      // TODO: add tokens for opacity and state layers
      action: {
        // M3's enabled state
        // active:
        // activatedOpacity:

        // M3's disabled state
        disabled: rgba(theme.sys.color.onSurface, 0.38),
        disabledBackground: rgba(theme.sys.color.onSurface, 0.1),
        disabledOpacity: 0.38,

        // M3's hover state
        hover: rgba(theme.sys.color.onSurface, 0.08),
        hoverOpacity: 0.08,

        // M3's focused state
        focus: rgba(theme.sys.color.onSurface, 0.1),
        focusOpacity: 0.1,

        // M3's selected variant
        // selected: theme.sys.color.secondaryContainer,
        // selectedOpacity: 0.1,
      },
    },
  });

  return {
    colorSchemes: {
      light: getColorScheme(lightTheme),
      dark: getColorScheme(darkTheme),
    },
  };
};

export default simpleTranslateM3toMui;
