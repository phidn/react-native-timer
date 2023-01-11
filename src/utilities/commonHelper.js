// WARNING: This is not a drop in replacement solution and
export const isNumber = (a) => typeof a === 'number'

export const range = (start, end, increment) => {
  const isEndDef = typeof end !== 'undefined'
  end = isEndDef ? end : start
  start = isEndDef ? start : 0

  if (typeof increment === 'undefined') {
    increment = Math.sign(end - start)
  }

  const length = Math.abs((end - start) / (increment || 1))

  const { result } = Array.from({ length }).reduce(
    ({ result, current }) => ({
      result: [...result, current],
      current: current + increment,
    }),
    { current: start, result: [] }
  )

  return result
}

export const roundNumber = (number, decimal_places = 0) => {
  const places = 10 ** decimal_places
  const result = Math.round(number * places) / places
  return result
}

// console.log(roundNearest5(13)); // 👉️ 15
// console.log(roundNearest5(-12)); // 👉️ -10
export const roundNearest = (num, numNearest = 5) => {
  return Math.round(num / numNearest) * numNearest
}

/**
 *
 * Getting a random integer between two values, inclusive
 */
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const capitalize = (string) => {
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`
}
