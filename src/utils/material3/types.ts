export type ColorString = string;

export interface Material3TokenClasses {
  ref?: Material3RefTokens;
  sys?: Material3SysTokens;
  comp?: Material3CompTokens;
}

export interface Material3Tokens {
  md: Material3TokenClasses;
}

////////////////////////////////////////////////////////////////////////////////
// Reference Tokens
////////////////////////////////////////////////////////////////////////////////

/**
 * @see https://github.com/material-foundation/material-tokens/blob/main/css/palette.css
 */
export interface Material3RefPaletteTokens {
  primary100?: ColorString;
  primary99?: ColorString;
  primary98?: ColorString;
  primary95?: ColorString;
  primary90?: ColorString;
  primary80?: ColorString;
  primary70?: ColorString;
  primary60?: ColorString;
  primary50?: ColorString;
  primary40?: ColorString;
  primary30?: ColorString;
  primary20?: ColorString;
  primary10?: ColorString;
  primary0?: ColorString;

  secondary100?: ColorString;
  secondary99?: ColorString;
  secondary98?: ColorString;
  secondary95?: ColorString;
  secondary90?: ColorString;
  secondary80?: ColorString;
  secondary70?: ColorString;
  secondary60?: ColorString;
  secondary50?: ColorString;
  secondary40?: ColorString;
  secondary30?: ColorString;
  secondary20?: ColorString;
  secondary10?: ColorString;
  secondary0?: ColorString;

  tertiary100?: ColorString;
  tertiary99?: ColorString;
  tertiary98?: ColorString;
  tertiary95?: ColorString;
  tertiary90?: ColorString;
  tertiary80?: ColorString;
  tertiary70?: ColorString;
  tertiary60?: ColorString;
  tertiary50?: ColorString;
  tertiary40?: ColorString;
  tertiary30?: ColorString;
  tertiary20?: ColorString;
  tertiary10?: ColorString;
  tertiary0?: ColorString;

  error100?: ColorString;
  error99?: ColorString;
  error98?: ColorString;
  error95?: ColorString;
  error90?: ColorString;
  error80?: ColorString;
  error70?: ColorString;
  error60?: ColorString;
  error50?: ColorString;
  error40?: ColorString;
  error30?: ColorString;
  error20?: ColorString;
  error10?: ColorString;
  error0?: ColorString;

  neutral100?: ColorString;
  neutral99?: ColorString;
  neutral98?: ColorString;
  neutral96?: ColorString;
  neutral95?: ColorString;
  neutral94?: ColorString;
  neutral92?: ColorString;
  neutral90?: ColorString;
  neutral87?: ColorString;
  neutral80?: ColorString;
  neutral70?: ColorString;
  neutral60?: ColorString;
  neutral50?: ColorString;
  neutral40?: ColorString;
  neutral30?: ColorString;
  neutral24?: ColorString;
  neutral22?: ColorString;
  neutral20?: ColorString;
  neutral17?: ColorString;
  neutral12?: ColorString;
  neutral10?: ColorString;
  neutral6?: ColorString;
  neutral4?: ColorString;
  neutral0?: ColorString;

  neutralVariant100?: ColorString;
  neutralVariant99?: ColorString;
  neutralVariant98?: ColorString;
  neutralVariant95?: ColorString;
  neutralVariant90?: ColorString;
  neutralVariant80?: ColorString;
  neutralVariant70?: ColorString;
  neutralVariant60?: ColorString;
  neutralVariant50?: ColorString;
  neutralVariant40?: ColorString;
  neutralVariant30?: ColorString;
  neutralVariant20?: ColorString;
  neutralVariant10?: ColorString;
  neutralVariant0?: ColorString;

  black?: ColorString;
  white?: ColorString;
}

export interface Material3RefTokens {
  palette?: Material3RefPaletteTokens;
}

////////////////////////////////////////////////////////////////////////////////
// System Tokens
////////////////////////////////////////////////////////////////////////////////

export interface Material3SysFixedColorTokens {
  /** Primary color that doesn't change for light or dark theme. */
  primaryFixed?: ColorString;
  /** Used for text and icons shown against the primary fixed color */
  onPrimaryFixed?: ColorString;
  /** Dimmer version of primary fixed color that doesn't change for light or dark theme. */
  primaryFixedDim?: ColorString;
  /** Stronger hue variant used for text and icons shown against the primary fixed color */
  onPrimaryFixedVariant?: ColorString;

  /** Secondary color that doesn't change for light or dark theme. */
  secondaryFixed?: ColorString;
  /** Used for text and icons shown against the secondary fixed color */
  onSecondaryFixed?: ColorString;
  /** Dimmer version of secondary fixed color that doesn't change for light or dark theme. */
  secondaryFixedDim?: ColorString;
  /** Stronger hue variant used for text and icons shown against the secondary fixed color */
  onSecondaryFixedVariant?: ColorString;

  /** Tertiary color that doesn't change for light or dark theme. */
  tertiaryFixed?: ColorString;
  /** Used for text and icons shown against the tertiary fixed color */
  onTertiaryFixed?: ColorString;
  /** Dimmer version of tertiary fixed color that doesn't change for light or dark theme. */
  tertiaryFixedDim?: ColorString;
  /** Stronger hue variant used for text and icons shown against the tertiary fixed color */
  onTertiaryFixedVariant?: ColorString;
}

/**
 * @see https://m3.material.io/styles/color/roles
 * @see https://m3.material.io/styles/color/static/baseline#c9263303-f4ef-4a33-ad57-7d91dc736b6b
 */
export interface Material3SysColorTokens extends Material3SysFixedColorTokens {
  /** Main color used across screens and components */
  primary?: ColorString;
  /** Text and icons shown against the primary color */
  onPrimary?: ColorString;
  /** Standout container color for key components */
  primaryContainer?: ColorString;
  /** Contrast-passing color shown against the primary container */
  onPrimaryContainer?: ColorString;

  /** Accent color used across screens and components */
  secondary?: ColorString;
  /** Text and icons shown against the secondary color */
  onSecondary?: ColorString;
  /** Less prominent container color, for components like tonal buttons */
  secondaryContainer?: ColorString;
  /** Contrast-passing color shown against the secondary container */
  onSecondaryContainer?: ColorString;

  /** Contrasting accent color used across screens and components */
  tertiary?: ColorString;
  /** Text and icons shown against the tertiary color */
  onTertiary?: ColorString;
  /** Contrasting container color, for components like input fields */
  tertiaryContainer?: ColorString;
  /** Contrast-passing color shown against the tertiary container */
  onTertiaryContainer?: ColorString;

  /** Indicates errors, such as invalid input in a date picker */
  error?: ColorString;
  /** Used for text and icons on the error color */
  onError?: ColorString;
  /** Container color for error messages and badges */
  errorContainer?: ColorString;
  /** Used for text and icons on the error-container color */
  onErrorContainer?: ColorString;

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
  surface?: ColorString;
  /** Text and icons shown against the surface color */
  onSurface?: ColorString;
  /** Alternate surface color, can be used for active states */
  surfaceVariant?: ColorString;
  /** For text and icons to indicate active or inactive component state */
  onSurfaceVariant?: ColorString;

  /** Highest-emphasis container color */
  surfaceContainerHighest?: ColorString;
  /** High-emphasis container color */
  surfaceContainerHigh?: ColorString;
  /** Default container color */
  surfaceContainer?: ColorString;
  /** Low-emphasis container color */
  surfaceContainerLow?: ColorString;
  /** Lowest-emphasis container color */
  surfaceContainerLowest?: ColorString;

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
  surfaceBright?: ColorString;
  /** Surface that is dimmer in both light and dark theme. */
  surfaceDim?: ColorString;

  /** Subtle color used for boundaries */
  outline?: ColorString;
  /** Outline-variant is used to define the border of a component where 3:1 contrast ratio isn’t required, a container, or a divider. */
  outlineVariant?: ColorString;

  /** Used for scrims which help separate floating components from the background. */
  scrim?: ColorString;
  /** For shadows applied to elevated components */
  shadow?: ColorString;

  /** Displays opposite color of the surrounding UI */
  inverseSurface?: ColorString;
  /** Used for text and icons shown against the inverse surface color */
  inverseOnSurface?: ColorString;
  /** Displays opposite of the primary color */
  inversePrimary?: ColorString;
}

export type Material3SysDynamicColorTokens = Omit<
  Material3SysColorTokens,
  keyof Material3SysFixedColorTokens
>;

export interface Material3SysTokens {
  color?: Material3SysColorTokens;
}

////////////////////////////////////////////////////////////////////////////////
// Component Tokens
////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Material3CompTokens {}
