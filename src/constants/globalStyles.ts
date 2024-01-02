import { StyleSheet } from 'react-native';
import { appPallette, autoSparkleColor, autoSparkleColorBlue, isDarkMode } from './colors';

export const globalStyles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    flexGrow: 1,
  },
  purpleButton: {
    marginTop: 8,
    backgroundColor: autoSparkleColor,
    borderColor: autoSparkleColor,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: isDarkMode ? appPallette.white : appPallette.dark,
    fontSize: 12,
    backgroundColor: appPallette.border,
  },
  badgeDanger: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: appPallette.white,
    fontSize: 12,
    backgroundColor: appPallette.red,
  },
  badgeSuccess: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: appPallette.white,
    fontSize: 12,
    backgroundColor: appPallette.green,
  },
  badgeSparkle: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: appPallette.white,
    fontSize: 12,
    backgroundColor: autoSparkleColorBlue,
  },
});
