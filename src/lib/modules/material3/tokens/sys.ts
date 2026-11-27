import { ColorString } from './types';

export interface Material3SysFixedColorTokens {
  /** Primary color that doesn't change for light or dark theme. */
  primaryFixed: ColorString;
  /** Used for text and icons shown against the primary fixed color */
  onPrimaryFixed: ColorString;
  /** Dimmer version of primary fixed color that doesn't change for light or dark theme. */
  primaryFixedDim: ColorString;
  /** Stronger hue variant used for text and icons shown against the primary fixed color */
  onPrimaryFixedVariant: ColorString;

  /** Secondary color that doesn't change for light or dark theme. */
  secondaryFixed: ColorString;
  /** Used for text and icons shown against the secondary fixed color */
  onSecondaryFixed: ColorString;
  /** Dimmer version of secondary fixed color that doesn't change for light or dark theme. */
  secondaryFixedDim: ColorString;
  /** Stronger hue variant used for text and icons shown against the secondary fixed color */
  onSecondaryFixedVariant: ColorString;

  /** Tertiary color that doesn't change for light or dark theme. */
  tertiaryFixed: ColorString;
  /** Used for text and icons shown against the tertiary fixed color */
  onTertiaryFixed: ColorString;
  /** Dimmer version of tertiary fixed color that doesn't change for light or dark theme. */
  tertiaryFixedDim: ColorString;
  /** Stronger hue variant used for text and icons shown against the tertiary fixed color */
  onTertiaryFixedVariant: ColorString;
}

/**
 * @see https://m3.material.io/styles/color/roles
 * @see https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export interface Material3SysColorTokens extends Material3SysFixedColorTokens {
  /** Main color used across screens and components */
  primary: ColorString;
  /** Text and icons shown against the primary color */
  onPrimary: ColorString;
  /** Standout container color for key components */
  primaryContainer: ColorString;
  /** Contrast-passing color shown against the primary container */
  onPrimaryContainer: ColorString;

  /** Accent color used across screens and components */
  secondary: ColorString;
  /** Text and icons shown against the secondary color */
  onSecondary: ColorString;
  /** Less prominent container color, for components like tonal buttons */
  secondaryContainer: ColorString;
  /** Contrast-passing color shown against the secondary container */
  onSecondaryContainer: ColorString;

  /** Contrasting accent color used across screens and components */
  tertiary: ColorString;
  /** Text and icons shown against the tertiary color */
  onTertiary: ColorString;
  /** Contrasting container color, for components like input fields */
  tertiaryContainer: ColorString;
  /** Contrast-passing color shown against the tertiary container */
  onTertiaryContainer: ColorString;

  /** Indicates errors, such as invalid input in a date picker */
  error: ColorString;
  /** Used for text and icons on the error color */
  onError: ColorString;
  /** Container color for error messages and badges */
  errorContainer: ColorString;
  /** Used for text and icons on the error-container color */
  onErrorContainer: ColorString;

  /**
   * Note: Background is a legacy color role. It is recommended to use Surface instead of Background.
   * @deprecated Use {@linkcode surface} instead
   */
  background?: ColorString;
  /**
   * Used for text and icons shown against the background color
   * @deprecated Use {@linkcode onSurface} instead
   */
  onBackground?: ColorString;

  /** Surface color for components like cards, sheets, and menus */
  surface: ColorString;
  /** Text and icons shown against the surface color */
  onSurface: ColorString;
  /** Alternate surface color, can be used for active states */
  surfaceVariant: ColorString;
  /** For text and icons to indicate active or inactive component state */
  onSurfaceVariant: ColorString;

  /** Highest-emphasis container color */
  surfaceContainerHighest: ColorString;
  /** High-emphasis container color */
  surfaceContainerHigh: ColorString;
  /** Default container color */
  surfaceContainer: ColorString;
  /** Low-emphasis container color */
  surfaceContainerLow: ColorString;
  /** Lowest-emphasis container color */
  surfaceContainerLowest: ColorString;

  /**
   * @deprecated Use these instead:
   * {@linkcode surfaceContainerHighest},
   * {@linkcode surfaceContainerHigh},
   * {@linkcode surfaceContainer},
   * {@linkcode surfaceContainerLow},
   * {@linkcode surfaceContainerLowest}
   */
  surfaceTint?: ColorString;

  /** Surface that is brighter in both light and dark theme. */
  surfaceBright: ColorString;
  /** Surface that is dimmer in both light and dark theme. */
  surfaceDim: ColorString;

  /** Subtle color used for boundaries */
  outline: ColorString;
  /** Outline-variant is used to define the border of a component where 3:1 contrast ratio isn’t required, a container, or a divider. */
  outlineVariant: ColorString;

  /** Used for scrims which help separate floating components from the background. */
  scrim: ColorString;
  /** For shadows applied to elevated components */
  shadow: ColorString;

  /** Displays opposite color of the surrounding UI */
  inverseSurface: ColorString;
  /** Used for text and icons shown against the inverse surface color */
  inverseOnSurface: ColorString;
  /** Displays opposite of the primary color */
  inversePrimary: ColorString;
}

export type Material3SysDynamicColorTokens = Omit<
  Material3SysColorTokens,
  keyof Material3SysFixedColorTokens
>;

export default interface Material3SysTokens {
  color: Material3SysColorTokens;
}
