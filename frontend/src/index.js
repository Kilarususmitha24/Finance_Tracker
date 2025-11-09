import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import App from './App';
import './styles/global.css';
import './styles/light.css';
import './styles/dark.css';

// Create root element
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Log environment for debugging
console.log('Environment:', process.env.NODE_ENV);

// Render the app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProviderWrapper>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
        >
          <AuthProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProviderWrapper>
    </BrowserRouter>
  </React.StrictMode>
);
