import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al body y guardar en localStorage
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Modo Claro - Tonalidades blancas suaves
      light: {
        primary: '#f8f9fa',
        secondary: '#e9ecef',
        accent: '#6c757d',
        background: '#ffffff',
        surface: '#f8f9fa',
        text: '#212529',
        textSecondary: '#6c757d',
        border: '#dee2e6',
        card: '#ffffff',
        nav: '#ffffff',
        sidebar: '#f8f9fa',
        physics: '#dc3545',
        math: '#0d6efd',
        shadow: 'rgba(0, 0, 0, 0.1)'
      },
      // Modo Oscuro - Tonalidades suaves
      dark: {
        primary: '#2d3748',
        secondary: '#4a5568',
        accent: '#718096',
        background: '#1a202c',
        surface: '#2d3748',
        text: '#f7fafc',
        textSecondary: '#a0aec0',
        border: '#4a5568',
        card: '#2d3748',
        nav: '#2d3748',
        sidebar: '#1a202c',
        physics: '#fc8181',
        math: '#63b3ed',
        shadow: 'rgba(0, 0, 0, 0.3)'
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};