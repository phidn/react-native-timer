import { MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper'
import {
  DefaultTheme as NavigationLightTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native'
import color from 'color'
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities'
import { themeSources } from '@/config/config'

export const createDynamicThemeColors = ({ sourceColor }) => {
  const opacity = {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  }

  const modes = ['light', 'dark']
  const { schemes, palettes } = themeFromSourceColor(argbFromHex(color(sourceColor).hex()))
  const { light, dark } = modes.reduce(
    (prev, curr) => {
      const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14]
      const schemeModeJSON = schemes[curr].toJSON()
      const elevation = elevations.reduce(
        (a, v, index) =>
          Object.assign(Object.assign({}, a), {
            [`level${index}`]:
              index === 0
                ? v
                : color(schemeModeJSON.surface)
                    .mix(color(schemeModeJSON.primary), Number(v))
                    .rgb()
                    .string(),
          }),
        {}
      )
      const customColors = {
        surfaceDisabled: color(schemeModeJSON.onSurface).alpha(opacity.level2).rgb().string(),
        onSurfaceDisabled: color(schemeModeJSON.onSurface).alpha(opacity.level4).rgb().string(),
        backdrop: color(palettes.neutralVariant.tone(20)).alpha(0.4).rgb().string(),
      }
      const dynamicThemeColors = Object.assign(
        {},
        ...Object.entries(schemeModeJSON).map(([colorName, colorValue]) => ({
          [colorName]: color(colorValue).rgb().string(),
        })),
        Object.assign({ elevation }, customColors)
      )
      return Object.assign(Object.assign({}, prev), { [curr]: dynamicThemeColors })
    },
    { light: {}, dark: {} }
  )
  return { light, dark }
}

export const combineTheme = (source, isDarkMode) => {
  let customTheme
  try {
    customTheme = createDynamicThemeColors({ sourceColor: source })
  } catch (error) {
    logger('→ combineTheme error:', error)
    customTheme = createDynamicThemeColors({ sourceColor: 'purple' })
  }
  const selectedSchema = {
    source,
    light: { colors: customTheme.light },
    dark: { colors: customTheme.dark }
  }

  const selectedSchemaColors = selectedSchema[isDarkMode ? 'dark' : 'light'].colors

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

export const getThemeColors = () => {
  return themeSources.map((source) => {
    const theme = createDynamicThemeColors({ sourceColor: source })
  
    return {
      source,
      light: { colors: theme.light },
      dark: { colors: theme.dark },
    }
  })
}
