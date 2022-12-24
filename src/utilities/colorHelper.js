export const getAlphaByPercent = (percent) => {
  if (percent > 0 && percent < 40) return 0.4
  if (percent >= 40 && percent < 60) return 0.6
  if (percent >= 60 && percent < 80) return 0.8
  if (percent >= 80) return 1
  return 0
}
