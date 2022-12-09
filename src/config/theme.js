import { meditationColors } from './colors/meditationColors'

export const themeMeditationColors = meditationColors.map((meditationColor, index) => ({
  label: `Meditation Color ${index + 1}`,
  value: meditationColor,
}))

export const themeColors = [...themeMeditationColors]
