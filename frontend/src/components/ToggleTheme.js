import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ToggleTheme = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <span className="text-yellow-300 text-xl">☀️</span>
      ) : (
        <span className="text-gray-700 text-xl">🌙</span>
      )}
    </button>
  );
};

export default ToggleTheme;
