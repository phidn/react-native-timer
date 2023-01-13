import { createDynamicThemeColors } from '@/utilities/themeHelper'

export const themeSources = [
  'purple',
  'pink',
  'indigo',
  'blue',
  'teal',
  'green',
  'yellow',
  'orange',
  'brown',
]

export const themeColors = themeSources.map((source, index) => {
  const theme = createDynamicThemeColors({ sourceColor: source })

  return {
    source,
    light: { colors: theme.light },
    dark: { colors: theme.dark }
  }
})

/**
 * App.js
 * logger('→ combineTheme', combineTheme('purple', false))
 */
export const initCombineTheme = {
  "dark": false,
  "roundness": 4,
  "version": 3,
  "isV3": true,
  "colors": {
    "primary": "rgb(158, 42, 155)",
    "primaryContainer": "rgb(255, 215, 245)",
    "secondary": "rgb(109, 88, 105)",
    "secondaryContainer": "rgb(247, 218, 239)",
    "tertiary": "rgb(130, 83, 69)",
    "tertiaryContainer": "rgb(255, 219, 209)",
    "surface": "rgb(255, 251, 255)",
    "surfaceVariant": "rgb(238, 222, 231)",
    "surfaceDisabled": "rgba(30, 26, 29, 0.12)",
    "background": "rgb(255, 251, 255)",
    "error": "rgb(186, 26, 26)",
    "errorContainer": "rgb(255, 218, 214)",
    "onPrimary": "rgb(255, 255, 255)",
    "onPrimaryContainer": "rgb(56, 0, 56)",
    "onSecondary": "rgb(255, 255, 255)",
    "onSecondaryContainer": "rgb(39, 22, 36)",
    "onTertiary": "rgb(255, 255, 255)",
    "onTertiaryContainer": "rgb(50, 18, 8)",
    "onSurface": "rgb(30, 26, 29)",
    "onSurfaceVariant": "rgb(78, 68, 75)",
    "onSurfaceDisabled": "rgba(30, 26, 29, 0.38)",
    "onError": "rgb(255, 255, 255)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "onBackground": "rgb(30, 26, 29)",
    "outline": "rgb(128, 116, 124)",
    "outlineVariant": "rgb(209, 194, 203)",
    "inverseSurface": "rgb(52, 47, 50)",
    "inverseOnSurface": "rgb(248, 238, 242)",
    "inversePrimary": "rgb(255, 170, 243)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "backdrop": "rgba(55, 46, 52, 0.4)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(250, 241, 250)",
      "level2": "rgb(247, 234, 247)",
      "level3": "rgb(244, 228, 244)",
      "level4": "rgb(243, 226, 243)",
      "level5": "rgb(241, 222, 241)"
    },
    "card": "rgb(247, 234, 247)",
    "text": "rgba(28, 27, 31, 1)",
    "border": "rgba(121, 116, 126, 1)",
    "notification": "rgba(179, 38, 30, 1)"
  },
  "fonts": {
    "displayLarge": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 64,
      "fontSize": 57
    },
    "displayMedium": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 52,
      "fontSize": 45
    },
    "displaySmall": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 44,
      "fontSize": 36
    },
    "headlineLarge": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 40,
      "fontSize": 32
    },
    "headlineMedium": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 36,
      "fontSize": 28
    },
    "headlineSmall": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 32,
      "fontSize": 24
    },
    "titleLarge": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400",
      "lineHeight": 28,
      "fontSize": 22
    },
    "titleMedium": {
      "fontFamily": "sans-serif-medium",
      "letterSpacing": 0.15,
      "fontWeight": "500",
      "lineHeight": 24,
      "fontSize": 16
    },
    "titleSmall": {
      "fontFamily": "sans-serif-medium",
      "letterSpacing": 0.1,
      "fontWeight": "500",
      "lineHeight": 20,
      "fontSize": 14
    },
    "labelLarge": {
      "fontFamily": "sans-serif-medium",
      "letterSpacing": 0.1,
      "fontWeight": "500",
      "lineHeight": 20,
      "fontSize": 14
    },
    "labelMedium": {
      "fontFamily": "sans-serif-medium",
      "letterSpacing": 0.5,
      "fontWeight": "500",
      "lineHeight": 16,
      "fontSize": 12
    },
    "labelSmall": {
      "fontFamily": "sans-serif-medium",
      "letterSpacing": 0.5,
      "fontWeight": "500",
      "lineHeight": 16,
      "fontSize": 11
    },
    "bodyLarge": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0.15,
      "fontWeight": "400",
      "lineHeight": 24,
      "fontSize": 16
    },
    "bodyMedium": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0.25,
      "fontWeight": "400",
      "lineHeight": 20,
      "fontSize": 14
    },
    "bodySmall": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0.4,
      "fontWeight": "400",
      "lineHeight": 16,
      "fontSize": 12
    },
    "default": {
      "fontFamily": "sans-serif",
      "letterSpacing": 0,
      "fontWeight": "400"
    }
  },
  "animation": {
    "scale": 1
  }
}

export const initTheme = {
  color: themeSources[0],
  isDarkMode: false,
  combineTheme: initCombineTheme
}
