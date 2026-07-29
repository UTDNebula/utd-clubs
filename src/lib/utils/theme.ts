'use client';

import { ThemeOptions } from '@mui/material/styles';
import { createMuiThemeWithM3 } from './material3/translator';
import {
  baselineMapPaletteToSchemes,
  baselineMaterialColorPalette,
} from './material3/baseline';
import { createDynamicMaterial3Theme } from './material3/theme';
import { Material3RefPaletteTokens } from './material3/types';

const ClubsColorPalette: Material3RefPaletteTokens = {
  ...baselineMaterialColorPalette,
  primary40: '#573dff',
  primary80: '#a297fd',
  tertiary40: '#b64af9',
  black: '#000000',
  white: '#ffffff',
};

const ClubsThemeSystemColorSchemeValues =
  baselineMapPaletteToSchemes(ClubsColorPalette);

export const ClubsTheme = createDynamicMaterial3Theme({
  ref: { palette: ClubsColorPalette },
  sys: { colorScheme: ClubsThemeSystemColorSchemeValues },
  comp: {},
});

const lightPalette = {
  palette: {
    //copied from globals.css
    primary: {
      main: '#573dff',
    },
    secondary: {
      main: '#573dff',
      light: '#c2c8ff',
    },
    error: {
      main: '#ff5743',
    },
    info: {
      light: '#857efc',
      main: '#6266fa',
      dark: '#45449f',
    },
  },
};
const darkPalette = {
  palette: {
    //copied from globals.css
    primary: {
      main: '#a297fd',
    },
    secondary: {
      main: '#573dff',
      light: '#c2c8ff',
    },
    error: {
      main: '#ff5743',
    },
  },
};
const themeOptions: ThemeOptions = {
  cssVariables: true,
  colorSchemes: {
    light: lightPalette,
    dark: darkPalette,
  },
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

const theme = createMuiThemeWithM3(ClubsTheme, themeOptions);

export default theme;
