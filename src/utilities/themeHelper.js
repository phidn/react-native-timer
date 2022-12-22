import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper'
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native'
import { themeColors } from '@/config/theme'
import color from 'color'

export const combineTheme = (label, isDarkMode) => {
  const selectedSchema = themeColors.find((x) => x.label === label) || themeColors[0]
  const selectedSchemaColors = selectedSchema.value[isDarkMode ? 'dark' : 'light'].colors

  const MD3Theme = isDarkMode ? MD3DarkTheme : MD3LightTheme

  const NavigationTheme = isDarkMode
    ? adaptNavigationTheme({ reactNavigationDark: NavigationDarkTheme }).DarkTheme
    : adaptNavigationTheme({ reactNavigationLight: NavigationLightTheme }).LightTheme

  const customCardColor = color(selectedSchemaColors.surface)
    .mix(color(selectedSchemaColors.primary), 0.08)
    .rgb()
    .string()

  const combinedTheme = {
    ...MD3Theme,
    ...NavigationTheme,
    colors: {
      ...MD3Theme.colors,
      ...NavigationTheme.colors,
      ...selectedSchemaColors,
      card: customCardColor,
    },
  }

  return combinedTheme
}
