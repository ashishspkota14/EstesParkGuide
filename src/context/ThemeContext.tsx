import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, Theme } from '../constants/colors';

type ThemeKey = keyof typeof THEMES;

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeKey;
  setTheme: (themeKey: ThemeKey) => Promise<void>;
  availableThemes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeKey>('greenish');
  const [theme, setThemeState] = useState<Theme>(THEMES.greenish);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && savedTheme in THEMES) {
        const themeKey = savedTheme as ThemeKey;
        setThemeName(themeKey);
        setThemeState(THEMES[themeKey]);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (themeKey: ThemeKey) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeKey);
      setThemeName(themeKey);
      setThemeState(THEMES[themeKey]);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeName, 
      setTheme, 
      availableThemes: THEMES 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper hook to get colors (for easy migration)
export function useColors() {
  const { theme } = useTheme();
  return theme;
}