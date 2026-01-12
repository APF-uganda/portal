import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 600,
      textDecoration: 'none',
      borderBottom: 'none',
    },
    body1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#7c3aed',
      dark: '#6d28d9',
    },
    secondary: {
      main: '#2c3e50',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
        h1: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
        h2: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
        h3: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
        h4: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
        h5: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
        h6: {
          textDecoration: 'none !important',
          borderBottom: 'none !important',
        },
      },
    },
  },
})

export default theme
