import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const HOUR = 60 * 60

const getHms = (t) => {
  const hms = t('Time.hms').split('_')
  const h = hms[0].charAt(0)
  const m = hms[1].charAt(0)
  const s = hms[2].charAt(0)

  return { h, m, s }
}

export const getTime = (duration, format) => {
  return dayjs.duration(duration, 'seconds').format(format)
}

export const getCountdown = (duration) => {
  return dayjs
    .duration(duration, 'seconds')
    .format(duration > HOUR ? 'HH:mm:ss' : 'mm:ss')
    .trim()
}

export const getInterval = (duration, t) => {
  const { m } = getHms(t)
  const result = dayjs
    .duration(duration, 'seconds')
    .format(`m[${m}]`)
  return result === `0${m}` ? 'Silent' : result
}

export const getDuration = (duration, t) => {
  const { h, m } = getHms(t)
  const re = new RegExp(`\\b0${h}\\b`)
  
  return dayjs
    .duration(duration, 'seconds')
    .format(`H[${h}] m[${m}]`)
    .replace(re, '')
}

export const sToMs = (seconds) => seconds * 1000
export const sToMin = (seconds) => seconds / 60
