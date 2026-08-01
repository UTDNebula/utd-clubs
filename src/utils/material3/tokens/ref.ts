import { ColorString } from './types';

/**
 * @see https://github.com/material-foundation/material-tokens/blob/main/css/palette.css
 */
export interface Material3RefPaletteTokens {
  primary100: ColorString;
  primary99: ColorString;
  primary98: ColorString;
  primary95: ColorString;
  primary90: ColorString;
  primary80: ColorString;
  primary70: ColorString;
  primary60: ColorString;
  primary50: ColorString;
  primary40: ColorString;
  primary30: ColorString;
  primary20: ColorString;
  primary10: ColorString;
  primary0: ColorString;

  secondary100: ColorString;
  secondary99: ColorString;
  secondary98: ColorString;
  secondary95: ColorString;
  secondary90: ColorString;
  secondary80: ColorString;
  secondary70: ColorString;
  secondary60: ColorString;
  secondary50: ColorString;
  secondary40: ColorString;
  secondary30: ColorString;
  secondary20: ColorString;
  secondary10: ColorString;
  secondary0: ColorString;

  tertiary100: ColorString;
  tertiary99: ColorString;
  tertiary98: ColorString;
  tertiary95: ColorString;
  tertiary90: ColorString;
  tertiary80: ColorString;
  tertiary70: ColorString;
  tertiary60: ColorString;
  tertiary50: ColorString;
  tertiary40: ColorString;
  tertiary30: ColorString;
  tertiary20: ColorString;
  tertiary10: ColorString;
  tertiary0: ColorString;

  error100: ColorString;
  error99: ColorString;
  error98: ColorString;
  error95: ColorString;
  error90: ColorString;
  error80: ColorString;
  error70: ColorString;
  error60: ColorString;
  error50: ColorString;
  error40: ColorString;
  error30: ColorString;
  error20: ColorString;
  error10: ColorString;
  error0: ColorString;

  neutral100: ColorString;
  neutral99: ColorString;
  neutral98: ColorString;
  neutral96: ColorString;
  neutral95: ColorString;
  neutral94: ColorString;
  neutral92: ColorString;
  neutral90: ColorString;
  neutral87: ColorString;
  neutral80: ColorString;
  neutral70: ColorString;
  neutral60: ColorString;
  neutral50: ColorString;
  neutral40: ColorString;
  neutral30: ColorString;
  neutral24: ColorString;
  neutral22: ColorString;
  neutral20: ColorString;
  neutral17: ColorString;
  neutral12: ColorString;
  neutral10: ColorString;
  neutral6: ColorString;
  neutral4: ColorString;
  neutral0: ColorString;

  neutralVariant100: ColorString;
  neutralVariant99: ColorString;
  neutralVariant98: ColorString;
  neutralVariant95: ColorString;
  neutralVariant90: ColorString;
  neutralVariant80: ColorString;
  neutralVariant70: ColorString;
  neutralVariant60: ColorString;
  neutralVariant50: ColorString;
  neutralVariant40: ColorString;
  neutralVariant30: ColorString;
  neutralVariant20: ColorString;
  neutralVariant10: ColorString;
  neutralVariant0: ColorString;

  black: ColorString;
  white: ColorString;
}

export default interface Material3RefTokens {
  palette: Material3RefPaletteTokens;
}
