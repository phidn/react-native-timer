import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper'
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native'

import { themeColors } from '@config/theme'

export const combineTheme = (label, isDarkMode) => {
  const selectedSchema = themeColors.find((x) => x.label === label) || themeColors[0]
  const selectedSchemaColors = selectedSchema.value[isDarkMode ? 'dark' : 'light'].colors

  const MD3Theme = isDarkMode ? MD3DarkTheme : MD3LightTheme

  const NavigationTheme = isDarkMode
    ? adaptNavigationTheme({ reactNavigationDark: NavigationDarkTheme }).DarkTheme
    : adaptNavigationTheme({ reactNavigationLight: NavigationLightTheme }).LightTheme

  const combinedTheme = {
    ...MD3Theme,
    ...NavigationTheme,
    colors: {
      ...MD3Theme.colors,
      ...NavigationTheme.colors,
      ...selectedSchemaColors,
    },
  }

  return combinedTheme
}
