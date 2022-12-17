function findColorLevel(count, rectColor) {
  if (count === 0) return rectColor[0]
  if (count >= 1 && count <= 3) return rectColor[1]
  if (count >= 4 && count <= 9) return rectColor[2]
  if (count >= 10 && count <= 17) return rectColor[3]
  if (count >= 18 && count <= 25) return rectColor[4]
  if (count >= 26) return rectColor[5]
  return rectColor[0]
}
