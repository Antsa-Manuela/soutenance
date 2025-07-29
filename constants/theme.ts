// constants/theme.ts
import { Platform } from 'react-native';
import { Colors } from './Colors';

export const theme = {
  light: {
    colors: {
      background: Colors.light.background,
      primary: '#69140E',
      secondary: '#D58936',
      accent: '#FFF94F',
      border: '#A44200',
      text: '#3C1518',
    },
    typography: {
      fontFamily: Platform.OS === 'web' ? 'Montserrat, sans-serif' : 'Open Sans',
      titleSize: 28,
      bodySize: 16,
    },
    spacing: {
      sm: 8,
      md: 16,
      lg: 24,
    },
    borderRadius: {
      sm: 6,
      md: 12,
    },
  },
  dark: {
    colors: {
      background: Colors.dark.background,
      primary: '#D58936',
      secondary: '#69140E',
      accent: '#3C1518',
      border: '#D58936',
      text: '#FFFFFF',
    },
    typography: {
      fontFamily: Platform.OS === 'web' ? 'Montserrat, sans-serif' : 'Open Sans',
      titleSize: 28,
      bodySize: 16,
    },
    spacing: {
      sm: 8,
      md: 16,
      lg: 24,
    },
    borderRadius: {
      sm: 6,
      md: 12,
    },
  },
};
