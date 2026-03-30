import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e53e3e',
      light: '#fc8181',
      dark: '#9b2c2c',
    },
    secondary: {
      main: '#f6ad55',
      light: '#fbd38d',
      dark: '#c05621',
    },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a',
    },
    success: {
      main: '#48bb78',
      light: '#9ae6b4',
    },
    warning: {
      main: '#f6ad55',
    },
    error: {
      main: '#fc8181',
    },
    text: {
      primary: '#f7fafc',
      secondary: '#a0aec0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.7rem',
        },
      },
    },
  },
});
