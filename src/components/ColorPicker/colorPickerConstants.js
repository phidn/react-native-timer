export const DEFAULT_PALETTE = [
  '#17203A',
  '#fd79a8',
  '#8e44ad',
  '#10ac84',
  '#8395a7',
  '#ecf0f1',
  '#ff9ff3',
  '#2e86de',
  '#fdcb6e',
  '#00cec9',
]
export const decimalToHexString = (number) => {
  if (number < 0) {
    number = 0xffffffff + number + 1
  }
  return `#${number.toString(16).substring(2, 8)}`
}
export const hexStringToDecimal = (hex) => {
  return parseInt('ff' + hex, 16) - 0xffffffff - 1
}
