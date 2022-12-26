import createDynamicThemeColors from '@/utilities/themeHelper'

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

export const themeMeditationColors = sources.map((source, index) => {
  const theme = createDynamicThemeColors({ sourceColor: source })

  return {
    source,
    label: `Meditation Color ${index + 1}`,
    light: { colors: theme.light },
    dark: { colors: theme.dark }
  }
})

export const themeColors = [...themeMeditationColors]
