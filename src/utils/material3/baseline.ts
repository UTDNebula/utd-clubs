import { createDynamicMaterial3Theme } from './theme';
import {
  Material3RefPaletteTokens,
  Material3SysDynamicColorTokens,
  Material3Tokens,
} from './types';

/**
 * @see
 * Palettes category of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
const baselineMaterialColorPalette: Material3RefPaletteTokens = {
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
 * @see
 * Color schemes category with light theme of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselineMaterialLightColorScheme: Material3SysDynamicColorTokens =
  {
    primary: baselineMaterialColorPalette.primary40,
    onPrimary: baselineMaterialColorPalette.primary100,
    primaryContainer: baselineMaterialColorPalette.primary90,
    onPrimaryContainer: baselineMaterialColorPalette.primary30,

    secondary: baselineMaterialColorPalette.secondary40,
    onSecondary: baselineMaterialColorPalette.secondary100,
    secondaryContainer: baselineMaterialColorPalette.secondary90,
    onSecondaryContainer: baselineMaterialColorPalette.secondary30,

    tertiary: baselineMaterialColorPalette.tertiary40,
    onTertiary: baselineMaterialColorPalette.tertiary100,
    tertiaryContainer: baselineMaterialColorPalette.tertiary90,
    onTertiaryContainer: baselineMaterialColorPalette.tertiary30,

    error: baselineMaterialColorPalette.error40,
    onError: baselineMaterialColorPalette.error100,
    errorContainer: baselineMaterialColorPalette.error90,
    onErrorContainer: baselineMaterialColorPalette.error30,

    surface: baselineMaterialColorPalette.neutral98,
    onSurface: baselineMaterialColorPalette.neutral10,
    surfaceVariant: baselineMaterialColorPalette.neutralVariant90,
    onSurfaceVariant: baselineMaterialColorPalette.neutralVariant30,

    surfaceContainerHighest: baselineMaterialColorPalette.neutral90,
    surfaceContainerHigh: baselineMaterialColorPalette.neutral92,
    surfaceContainer: baselineMaterialColorPalette.neutral94,
    surfaceContainerLow: baselineMaterialColorPalette.neutral96,
    surfaceContainerLowest: baselineMaterialColorPalette.neutral100,

    surfaceBright: baselineMaterialColorPalette.neutral98,
    surfaceDim: baselineMaterialColorPalette.neutral87,

    inverseSurface: baselineMaterialColorPalette.neutral20,
    inverseOnSurface: baselineMaterialColorPalette.neutral95,
    inversePrimary: baselineMaterialColorPalette.primary80,

    outline: baselineMaterialColorPalette.neutralVariant50,
    outlineVariant: baselineMaterialColorPalette.neutralVariant80,
    scrim: baselineMaterialColorPalette.neutral0,
    shadow: baselineMaterialColorPalette.neutral0,
  };

/**
 * @see
 * Color schemes category with dark theme of https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export const baselineMaterialDarkColorScheme: Material3SysDynamicColorTokens = {
  primary: baselineMaterialColorPalette.primary80,
  onPrimary: baselineMaterialColorPalette.primary20,
  primaryContainer: baselineMaterialColorPalette.primary30,
  onPrimaryContainer: baselineMaterialColorPalette.primary90,

  secondary: baselineMaterialColorPalette.secondary80,
  onSecondary: baselineMaterialColorPalette.secondary20,
  secondaryContainer: baselineMaterialColorPalette.secondary30,
  onSecondaryContainer: baselineMaterialColorPalette.secondary90,

  tertiary: baselineMaterialColorPalette.tertiary80,
  onTertiary: baselineMaterialColorPalette.tertiary20,
  tertiaryContainer: baselineMaterialColorPalette.tertiary30,
  onTertiaryContainer: baselineMaterialColorPalette.tertiary90,

  error: baselineMaterialColorPalette.error80,
  onError: baselineMaterialColorPalette.error20,
  errorContainer: baselineMaterialColorPalette.error30,
  onErrorContainer: baselineMaterialColorPalette.error90,

  surface: baselineMaterialColorPalette.neutral6,
  onSurface: baselineMaterialColorPalette.neutral90,
  surfaceVariant: baselineMaterialColorPalette.neutralVariant30,
  onSurfaceVariant: baselineMaterialColorPalette.neutralVariant80,

  surfaceContainerHighest: baselineMaterialColorPalette.neutral22,
  surfaceContainerHigh: baselineMaterialColorPalette.neutral17,
  surfaceContainer: baselineMaterialColorPalette.neutral12,
  surfaceContainerLow: baselineMaterialColorPalette.neutral10,
  surfaceContainerLowest: baselineMaterialColorPalette.neutral4,

  surfaceBright: baselineMaterialColorPalette.neutral24,
  surfaceDim: baselineMaterialColorPalette.neutral6,

  inverseSurface: baselineMaterialColorPalette.neutral90,
  inverseOnSurface: baselineMaterialColorPalette.neutral20,
  inversePrimary: baselineMaterialColorPalette.primary40,

  outline: baselineMaterialColorPalette.neutralVariant60,
  outlineVariant: baselineMaterialColorPalette.neutralVariant30,
  scrim: baselineMaterialColorPalette.neutral0,
  shadow: baselineMaterialColorPalette.neutral0,
};

export const baselineMaterialTokens: Material3Tokens = {
  md: {
    ref: {
      palette: baselineMaterialColorPalette,
    },
    sys: {
      color: baselineMaterialLightColorScheme,
    },
  },
};

export const baselineMaterial3Theme = createDynamicMaterial3Theme({
  ref: { palette: baselineMaterialColorPalette },
  sys: {
    colorScheme: {
      light: baselineMaterialLightColorScheme,
      dark: baselineMaterialDarkColorScheme,
    },
  },
});
