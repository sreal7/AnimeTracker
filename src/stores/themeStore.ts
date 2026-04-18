import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkMode: boolean;
  isLoading: boolean;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const THEME_KEY = '@anime_theme';

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  isLoading: true,

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      set({
        isDarkMode: saved === 'dark',
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleTheme: async () => {
    const newMode = !useThemeStore.getState().isDarkMode;
    await AsyncStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    set({ isDarkMode: newMode });
  },
}));