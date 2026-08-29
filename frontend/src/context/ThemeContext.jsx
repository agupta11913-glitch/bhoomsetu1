import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, updateUserPreferencesApi } from '../services/auth/authApi';

const ThemeContext = createContext();

export const THEMES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('bhoomisetu_theme');
      return (saved === 'DARK' || saved === 'dark') ? 'DARK' : 'LIGHT';
    } catch {
      return 'LIGHT';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'DARK') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark');
      body.classList.add('light');
    }

    try {
      localStorage.setItem('bhoomisetu_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme in storage', e);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme, persistToBackend = true) => {
    const normalized = (newTheme === 'DARK' || newTheme === 'dark') ? 'DARK' : 'LIGHT';
    setThemeState(normalized);

    if (persistToBackend && getToken()) {
      updateUserPreferencesApi({ themePreference: normalized }).catch((err) => {
        console.warn('Theme backend sync notice:', err.message);
      });
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'LIGHT' ? 'DARK' : 'LIGHT';
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'DARK'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  return ctx || {
    theme: 'LIGHT',
    setTheme: () => {},
    toggleTheme: () => {},
    isDark: false
  };
};
