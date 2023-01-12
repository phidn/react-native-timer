import { createDynamicThemeColors } from '@/utilities/themeHelper'

const sources = [
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

export const themeColors = sources.map((source, index) => {
  const theme = createDynamicThemeColors({ sourceColor: source })

  return {
    source,
    light: { colors: theme.light },
    dark: { colors: theme.dark }
  }
})
