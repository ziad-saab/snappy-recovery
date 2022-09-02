import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'hooks/auth';
import { MetaMaskProvider } from 'hooks/metamask';
import { createTheme, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { App } from './app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#3a3a3a',
      default: '#303030',
    },
    primary: {
      main: '#5c6bc0',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'small',
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MetaMaskProvider>
        <AuthProvider>
          <ThemeProvider theme={darkTheme}>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </MetaMaskProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
