import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const HOUR = 60 * 60

export const getTime = (duration, format) => {
  return dayjs.duration(duration, 'seconds').format(format)
}

export const getCountdown = (duration) => {
  return dayjs
    .duration(duration, 'seconds')
    .format(duration > HOUR ? 'HH:mm:ss' : 'mm:ss')
    .trim()
}

export const getInterval = (duration) => {
  const result = dayjs.duration(duration, 'seconds').format('m[m]')

  return result === '0m' ? 'Silent' : result
}

export const getDuration = (duration) => {
  return dayjs
    .duration(duration, 'seconds')
    .format('H[h] m[m]')
    .replace(/\b0h\b/, '')
}
