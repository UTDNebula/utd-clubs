'use client';

import { createTheme } from '@mui/material/styles';

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
const theme = createTheme({
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
});

export default theme;
