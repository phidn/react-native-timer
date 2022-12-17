// WARNING: This is not a drop in replacement solution and
export const isNumber = a => typeof a === 'number'

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
