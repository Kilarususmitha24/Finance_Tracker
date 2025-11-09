import React, { createContext, useContext } from 'react';
import { useSnackbar } from 'notistack';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const showAlert = (message, type = 'info') => {
    enqueueSnackbar(message, { 
      variant: type, 
      autoHideDuration: 3000,
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    });
  };

  const hideAlert = () => {
    // Not needed with notistack, but kept for compatibility
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};

export default AlertContext;
