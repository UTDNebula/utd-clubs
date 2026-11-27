import { Material3RefPaletteTokens } from '../tokens/ref';
import { createM3Theme } from './createM3Theme';
import { PaletteMapper } from './types';

/**
 * @see
 * Palettes category of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselinePalette: Material3RefPaletteTokens = {
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
 * Maps the values of reference color tokens to system color tokens, using the mapping from the baseline Material 3 theme.
 * @param palette Palette of reference tokens.
 * @returns The color tokens for light mode, dark mode, and fixed color tokens.
 *
 * @see
 * Mappings sourced from the light and dark themes under the color schemes category of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselinePaletteMapper: PaletteMapper = (palette) => ({
  light: {
    primary: palette.primary40,
    onPrimary: palette.primary100,
    primaryContainer: palette.primary90,
    onPrimaryContainer: palette.primary30,

    secondary: palette.secondary40,
    onSecondary: palette.secondary100,
    secondaryContainer: palette.secondary90,
    onSecondaryContainer: palette.secondary30,

    tertiary: palette.tertiary40,
    onTertiary: palette.tertiary100,
    tertiaryContainer: palette.tertiary90,
    onTertiaryContainer: palette.tertiary30,

    error: palette.error40,
    onError: palette.error100,
    errorContainer: palette.error90,
    onErrorContainer: palette.error30,

    surface: palette.neutral98,
    onSurface: palette.neutral10,
    surfaceVariant: palette.neutralVariant90,
    onSurfaceVariant: palette.neutralVariant30,

    surfaceContainerHighest: palette.neutral90,
    surfaceContainerHigh: palette.neutral92,
    surfaceContainer: palette.neutral94,
    surfaceContainerLow: palette.neutral96,
    surfaceContainerLowest: palette.neutral100,

    surfaceBright: palette.neutral98,
    surfaceDim: palette.neutral87,

    inverseSurface: palette.neutral20,
    inverseOnSurface: palette.neutral95,
    inversePrimary: palette.primary80,

    outline: palette.neutralVariant50,
    outlineVariant: palette.neutralVariant80,
    scrim: palette.neutral0,
    shadow: palette.neutral0,
  },
  dark: {
    primary: palette.primary80,
    onPrimary: palette.primary20,
    primaryContainer: palette.primary30,
    onPrimaryContainer: palette.primary90,

    secondary: palette.secondary80,
    onSecondary: palette.secondary20,
    secondaryContainer: palette.secondary30,
    onSecondaryContainer: palette.secondary90,

    tertiary: palette.tertiary80,
    onTertiary: palette.tertiary20,
    tertiaryContainer: palette.tertiary30,
    onTertiaryContainer: palette.tertiary90,

    error: palette.error80,
    onError: palette.error20,
    errorContainer: palette.error30,
    onErrorContainer: palette.error90,

    surface: palette.neutral6,
    onSurface: palette.neutral90,
    surfaceVariant: palette.neutralVariant30,
    onSurfaceVariant: palette.neutralVariant80,

    surfaceContainerHighest: palette.neutral22,
    surfaceContainerHigh: palette.neutral17,
    surfaceContainer: palette.neutral12,
    surfaceContainerLow: palette.neutral10,
    surfaceContainerLowest: palette.neutral4,

    surfaceBright: palette.neutral24,
    surfaceDim: palette.neutral6,

    inverseSurface: palette.neutral90,
    inverseOnSurface: palette.neutral20,
    inversePrimary: palette.primary40,

    outline: palette.neutralVariant60,
    outlineVariant: palette.neutralVariant30,
    scrim: palette.neutral0,
    shadow: palette.neutral0,
  },
  fixed: {
    primaryFixed: palette.primary90,
    onPrimaryFixed: palette.primary10,
    primaryFixedDim: palette.primary80,
    onPrimaryFixedVariant: palette.primary30,

    secondaryFixed: palette.secondary90,
    onSecondaryFixed: palette.secondary10,
    secondaryFixedDim: palette.secondary80,
    onSecondaryFixedVariant: palette.secondary30,

    tertiaryFixed: palette.tertiary90,
    onTertiaryFixed: palette.tertiary10,
    tertiaryFixedDim: palette.tertiary80,
    onTertiaryFixedVariant: palette.tertiary30,
  },
});

export const baselineMaterial3Theme = createM3Theme({
  ref: { palette: baselinePalette },
  sys: { colorScheme: baselinePaletteMapper },
  comp: {},
});
