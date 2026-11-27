'use client';

import { ThemeOptions } from '@mui/material/styles';
import { createThemeFromM3 } from '@/lib/modules/material3/integration/mui';
import {
  baselinePalette,
  baselinePaletteMapper,
} from '@/lib/modules/material3/theme/baseline';
import { createM3Theme } from '@/lib/modules/material3/theme/createM3Theme';
import { createPalette } from '@/lib/modules/material3/theme/utils';

const ClubsColorPalette = createPalette(
  {
    primary100: '#ffffff',
    primary99: '#fafaff',
    primary98: '#f6f5ff',
    primary95: '#edebff',
    primary90: '#d8d3ff',
    primary80: '#a297fd',
    primary70: '#8778ff',
    primary60: '#7964ff',
    primary50: '#664eff',
    primary40: '#573dff',
    primary30: '#432ecc',
    primary20: '#2d1b9f',
    primary10: '#170a66',
    primary0: '#000000',

    secondary100: '#ffffff',
    secondary99: '#fcfbfd',
    secondary98: '#f9f8fc',
    secondary95: '#efedf7',
    secondary90: '#e3def4',
    secondary80: '#c9c0e8',
    secondary70: '#b9ade0',
    secondary60: '#a294cf',
    secondary50: '#8f7fc3',
    secondary40: '#6b5e97',
    secondary30: '#4f4476',
    secondary20: '#3a305e',
    secondary10: '#1d1636',
    secondary0: '#000000',

    tertiary100: '#ffffff',
    tertiary99: '#fdfaff',
    tertiary98: '#fbf5ff',
    tertiary95: '#f7ebfe',
    tertiary90: '#f1ddfd',
    tertiary80: '#e7c4fd',
    tertiary70: '#ddacfb',
    tertiary60: '#cf8ff6',
    tertiary50: '#c574f7',
    tertiary40: '#b64af9',
    tertiary30: '#8b16d3',
    tertiary20: '#5d0f8d',
    tertiary10: '#2a0242',
    tertiary0: '#000000',

    error100: '#ffffff',
    error99: '#fefbfa',
    error98: '#fef6f6',
    error95: '#fdeeed',
    error90: '#f7d6d4',
    error80: '#edbdba',
    error70: '#e69893',
    error60: '#d3746e',
    error50: '#c44c45',
    error40: '#ac3730',
    error30: '#862d28',
    error20: '#601c18',
    error10: '#421411',
    error0: '#000000',

    neutral100: '#ffffff',
    neutral99: '#fcfcff',
    neutral98: '#f9f9fa',
    neutral96: '#f5f5f9',
    neutral95: '#f1f1f4',
    neutral94: '#eeeef1',
    neutral92: '#e6e6ea',
    neutral90: '#e1e0e6',
    neutral87: '#d6d5dd',
    neutral80: '#c6c4cf',
    neutral70: '#a8a6b5',
    neutral60: '#908e9f',
    neutral50: '#797788',
    neutral40: '#666473',
    neutral30: '#494752',
    neutral24: '#3c3b44',
    neutral22: '#36343c',
    neutral20: '#312f37',
    neutral17: '#2c2a32',
    neutral12: '#27252c',
    neutral10: '#1d1c22',
    neutral6: '#18171c',
    neutral4: '#111013',
    neutral0: '#000000',

    neutralVariant100: '#ffffff',
    neutralVariant99: '#fcfcfd',
    neutralVariant98: '#f7f6f8',
    neutralVariant95: '#efeef1',
    neutralVariant90: '#e7e6ea',
    neutralVariant80: '#d0cdd5',
    neutralVariant70: '#b0acb9',
    neutralVariant60: '#9692a0',
    neutralVariant50: '#837f8f',
    neutralVariant40: '#6a6576',
    neutralVariant30: '#4f4b58',
    neutralVariant20: '#39363f',
    neutralVariant10: '#201f23',
    neutralVariant0: '#000000',
  },
  baselinePalette,
);

export const ClubsTheme = createM3Theme({
  ref: { palette: ClubsColorPalette },
  sys: { colorScheme: baselinePaletteMapper },
  comp: {},
});

const themeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'inherit',
  },
  breakpoints: {
    values: {
      //copied from globals.css
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    mergeClassNameAndStyle: true,
    MuiButton: {
      defaultProps: {
        className: 'rounded-full',
      },
    },
  },
};

const theme = createThemeFromM3(ClubsTheme, themeOptions);

export default theme;
