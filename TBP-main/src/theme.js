import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
    },
    h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
    },
    h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: '#1976d2',
                boxShadow: 'none',
            }
        }
    }
  },
});

export default theme;
