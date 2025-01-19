import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff', // Background for containers
    },
    text: {
      primary: '#000000',
      secondary: '#333333',
    },
    primary: {
      main: '#8e44ad', // Header & Buttons
    },
    secondary: {
      main: '#6d308d', // Hover or accents
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#303030',
      paper: '#424242', // Background for containers
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
    primary: {
      main: '#bb86fc', // Purple-ish tone for buttons
    },
    secondary: {
      main: '#3700b3', // Darker purple accents
    },
  },
});
