import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Appearance } from 'react-native';

export const isDarkMode = Appearance.getColorScheme() === 'dark';

export const appPallette = {
  white: DefaultTheme.colors.background,
  dark: DarkTheme.colors.background,
  border: isDarkMode ? '#3d3d3d' : '#d4d4d4',
  green: '#1F8A70',
  red: '#DC3535',
};

export const autoSparkleColor = '#8D5DA4';
export const autoSparkleColorDark = '#662F89';
export const autoSparkleColorBlue = '#243870';

export const textColor = isDarkMode ? appPallette.white : appPallette.dark;
export const bgColor = isDarkMode ? appPallette.dark : appPallette.white;
export const cardColor = isDarkMode ? DarkTheme.colors.card : DefaultTheme.colors.card;
