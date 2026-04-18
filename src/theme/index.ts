import { colors, darkColors, spacing, typography } from './colors';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useThemeStore } from '../stores/themeStore';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[500],
    primaryContainer: colors.primary[100],
    secondary: colors.accent,
    secondaryContainer: colors.accent + '33',
    surface: colors.background.card,
    background: colors.background.base,
    text: colors.text.primary,
    onSurface: colors.text.primary,
    onBackground: colors.text.primary,
    outline: colors.border.primary,
    outlineVariant: colors.border.secondary,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkColors.primary[500],
    primaryContainer: darkColors.primary[900],
    secondary: darkColors.accent,
    secondaryContainer: darkColors.accent + '33',
    surface: darkColors.background.card,
    background: darkColors.background.base,
    text: darkColors.text.primary,
    onSurface: darkColors.text.primary,
    onBackground: darkColors.text.primary,
    outline: darkColors.border.primary,
    outlineVariant: darkColors.border.secondary,
  },
};

export { colors, darkColors, spacing, typography };

export const useThemeColors = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? darkColors : colors;
};

export const useAppTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? darkTheme : lightTheme;
};