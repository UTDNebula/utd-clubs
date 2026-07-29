import {
  createDynamicMaterial3Theme,
  DynamicMaterial3ThemeColorSchemeValues,
} from './theme';
import { Material3RefPaletteTokens } from './types';

/**
 * @see
 * Palettes category of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselineMaterialColorPalette: Material3RefPaletteTokens = {
  primary100: '#ffffff',
  primary99: '#fffbfe',
  primary98: '#fef7ff',
  primary95: '#f6edff',
  primary90: '#eaddff',
  primary80: '#d0bcff',
  primary70: '#b69df8',
  primary60: '#9a82db',
  primary50: '#7f67be',
  primary40: '#6750a4',
  primary30: '#4f378b',
  primary20: '#381e72',
  primary10: '#21005d',
  primary0: '#000000',

  secondary100: '#ffffff',
  secondary99: '#fffbfe',
  secondary98: '#fef7ff',
  secondary95: '#f6edff',
  secondary90: '#e8def8',
  secondary80: '#ccc2dc',
  secondary70: '#b0a7c0',
  secondary60: '#958da5',
  secondary50: '#7a7289',
  secondary40: '#625871',
  secondary30: '#4a4458',
  secondary20: '#332d41',
  secondary10: '#1d192b',
  secondary0: '#000000',

  tertiary100: '#ffffff',
  tertiary99: '#fffbfa',
  tertiary98: '#fff8f8',
  tertiary95: '#ffecf1',
  tertiary90: '#ffd8e4',
  tertiary80: '#efb8c8',
  tertiary70: '#d29dac',
  tertiary60: '#b58392',
  tertiary50: '#986977',
  tertiary40: '#7d5260',
  tertiary30: '#633b48',
  tertiary20: '#492532',
  tertiary10: '#31111d',
  tertiary0: '#000000',

  error100: '#ffffff',
  error99: '#fffbf9',
  error98: '#fff8f7',
  error95: '#fceeee',
  error90: '#f9dedc',
  error80: '#f2b8b5',
  error70: '#ec928e',
  error60: '#e46962',
  error50: '#dc362e',
  error40: '#b3261e',
  error30: '#8c1d18',
  error20: '#601410',
  error10: '#410e0b',
  error0: '#000000',

  neutral100: '#ffffff',
  neutral99: '#fffbff',
  neutral98: '#fef7ff',
  neutral96: '#f7f2fa',
  neutral95: '#f5eff7',
  neutral94: '#f3edf7',
  neutral92: '#ece6f0',
  neutral90: '#e6e0e9',
  neutral87: '#ded8e1',
  neutral80: '#cac5cd',
  neutral70: '#aea9b1',
  neutral60: '#938f96',
  neutral50: '#79767d',
  neutral40: '#605d64',
  neutral30: '#48464c',
  neutral24: '#3b383e',
  neutral22: '#36343b',
  neutral20: '#322f35',
  neutral17: '#2b2930',
  neutral12: '#211f26',
  neutral10: '#1d1b20',
  neutral6: '#141218',
  neutral4: '#0f0d13',
  neutral0: '#000000',

  neutralVariant100: '#ffffff',
  neutralVariant99: '#fffbfe',
  neutralVariant98: '#fdf7ff',
  neutralVariant95: '#f5eefa',
  neutralVariant90: '#e7e0ec',
  neutralVariant80: '#cac4d0',
  neutralVariant70: '#aea9b4',
  neutralVariant60: '#938f99',
  neutralVariant50: '#79747e',
  neutralVariant40: '#605d66',
  neutralVariant30: '#49454f',
  neutralVariant20: '#322f37',
  neutralVariant10: '#1d1a22',
  neutralVariant0: '#000000',

  black: '#000000',
  white: '#ffffff',
};

/**
 * Maps the values of color tokens to Material 3 system tokens, using the mapping from the baseline Material 3 theme.
 * @param refPalette Palette of reference tokens.
 * @returns The color tokens for light mode, dark mode, and fixed color tokens.
 *
 * @see
 * Mappings sourced from the light and dark themes under the color schemes category of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselineMapPaletteToSchemes = (
  refPalette: Material3RefPaletteTokens,
): DynamicMaterial3ThemeColorSchemeValues => ({
  light: {
    primary: refPalette.primary40,
    onPrimary: refPalette.primary100,
    primaryContainer: refPalette.primary90,
    onPrimaryContainer: refPalette.primary30,

    secondary: refPalette.secondary40,
    onSecondary: refPalette.secondary100,
    secondaryContainer: refPalette.secondary90,
    onSecondaryContainer: refPalette.secondary30,

    tertiary: refPalette.tertiary40,
    onTertiary: refPalette.tertiary100,
    tertiaryContainer: refPalette.tertiary90,
    onTertiaryContainer: refPalette.tertiary30,

    error: refPalette.error40,
    onError: refPalette.error100,
    errorContainer: refPalette.error90,
    onErrorContainer: refPalette.error30,

    surface: refPalette.neutral98,
    onSurface: refPalette.neutral10,
    surfaceVariant: refPalette.neutralVariant90,
    onSurfaceVariant: refPalette.neutralVariant30,

    surfaceContainerHighest: refPalette.neutral90,
    surfaceContainerHigh: refPalette.neutral92,
    surfaceContainer: refPalette.neutral94,
    surfaceContainerLow: refPalette.neutral96,
    surfaceContainerLowest: refPalette.neutral100,

    surfaceBright: refPalette.neutral98,
    surfaceDim: refPalette.neutral87,

    inverseSurface: refPalette.neutral20,
    inverseOnSurface: refPalette.neutral95,
    inversePrimary: refPalette.primary80,

    outline: refPalette.neutralVariant50,
    outlineVariant: refPalette.neutralVariant80,
    scrim: refPalette.neutral0,
    shadow: refPalette.neutral0,
  },
  dark: {
    primary: refPalette.primary80,
    onPrimary: refPalette.primary20,
    primaryContainer: refPalette.primary30,
    onPrimaryContainer: refPalette.primary90,

    secondary: refPalette.secondary80,
    onSecondary: refPalette.secondary20,
    secondaryContainer: refPalette.secondary30,
    onSecondaryContainer: refPalette.secondary90,

    tertiary: refPalette.tertiary80,
    onTertiary: refPalette.tertiary20,
    tertiaryContainer: refPalette.tertiary30,
    onTertiaryContainer: refPalette.tertiary90,

    error: refPalette.error80,
    onError: refPalette.error20,
    errorContainer: refPalette.error30,
    onErrorContainer: refPalette.error90,

    surface: refPalette.neutral6,
    onSurface: refPalette.neutral90,
    surfaceVariant: refPalette.neutralVariant30,
    onSurfaceVariant: refPalette.neutralVariant80,

    surfaceContainerHighest: refPalette.neutral22,
    surfaceContainerHigh: refPalette.neutral17,
    surfaceContainer: refPalette.neutral12,
    surfaceContainerLow: refPalette.neutral10,
    surfaceContainerLowest: refPalette.neutral4,

    surfaceBright: refPalette.neutral24,
    surfaceDim: refPalette.neutral6,

    inverseSurface: refPalette.neutral90,
    inverseOnSurface: refPalette.neutral20,
    inversePrimary: refPalette.primary40,

    outline: refPalette.neutralVariant60,
    outlineVariant: refPalette.neutralVariant30,
    scrim: refPalette.neutral0,
    shadow: refPalette.neutral0,
  },
  fixed: {
    primaryFixed: refPalette.primary90,
    onPrimaryFixed: refPalette.primary10,
    primaryFixedDim: refPalette.primary80,
    onPrimaryFixedVariant: refPalette.primary30,

    secondaryFixed: refPalette.secondary90,
    onSecondaryFixed: refPalette.secondary10,
    secondaryFixedDim: refPalette.secondary80,
    onSecondaryFixedVariant: refPalette.secondary30,

    tertiaryFixed: refPalette.tertiary90,
    onTertiaryFixed: refPalette.tertiary10,
    tertiaryFixedDim: refPalette.tertiary80,
    onTertiaryFixedVariant: refPalette.tertiary30,
  },
});

const baselineSystemColorSchemeValues =
  baselineMapPaletteToSchemes(baselineMaterialColorPalette);

export const baselineMaterial3Theme = createDynamicMaterial3Theme({
  ref: { palette: baselineMaterialColorPalette },
  sys: { colorScheme: baselineSystemColorSchemeValues },
  comp: {},
});
