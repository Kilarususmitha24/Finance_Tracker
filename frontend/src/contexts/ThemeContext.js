import React, { createContext, useContext, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ✅ Pure Dark Mode Theme Configuration
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // 🌞 Light Theme
                primary: { main: "#1976d2" },
                secondary: { main: "#9c27b0" },
                background: {
                  default: "#f9fafb",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#111827",
                  secondary: "#6b7280",
                },
                appBar: { main: "#1976d2" },
              }
            : {
                // 🌙 PURE DARK THEME
                primary: { main: "#1e88e5" },
                secondary: { main: "#ab47bc" },
                background: {
                  default: "#0a0a0a", // deep black
                  paper: "#121212", // dark gray surface
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#b0b0b0",
                },
                appBar: { main: "#181818" }, // matte black AppBar
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: 14,
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                transition: "background-color 0.3s ease",
                backgroundColor: mode === "light" ? "#1976d2" : "#181818",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: "all 0.3s ease",
                backgroundColor: mode === "light" ? "#ffffff" : "#121212",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#f8fafc" : "#181818",
                color: mode === "light" ? "#111827" : "#e5e5e5",
                transition: "background-color 0.3s ease",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
