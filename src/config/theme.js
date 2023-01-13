import { createDynamicThemeColors } from '@/utilities/themeHelper'

const themeSources = [
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

export const themeColors = themeSources.map((source) => {
  const theme = createDynamicThemeColors({ sourceColor: source })

  return {
    source,
    light: { colors: theme.light },
    dark: { colors: theme.dark },
  }
})
