import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

const HOUR = 60 * 60

const getHms = (t, length) => {
  let [h, m, s] = t('Time.hms').split('_')

  if (length) {
    h = h.slice(0, length)
    m = m.slice(0, length)
    s = s.slice(0, length)
  }

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
  const { m } = getHms(t, 1)
  const result = dayjs.duration(duration, 'seconds').format(`m[${m}]`)
  return result === `0${m}` ? 'Silent' : result
}

export const getDuration = (duration, t) => {
  const { h, m } = getHms(t, 1)
  const re = new RegExp(`\\b0${h}\\b`)

  return dayjs.duration(duration, 'seconds').format(`H[${h}] m[${m}]`).replace(re, '')
}

export const sToMs = (seconds) => seconds * 1000
export const sToMin = (seconds) => seconds / 60

export const getMinString = (min, t, lang) => {
  const { m } = getHms(t)
  if (lang === 'vi') {
    return m
  }
  if (lang === 'en') {
    if (min > 1) return m + 's'
    return m
  }
  return ''
}

const getdmy = (t, length) => {
  let [d, m, y] = t('Time.dmy').split('_')

  if (length) {
    d = d.slice(0, length)
    m = m.slice(0, length)
    y = y.slice(0, length)
  }

  return { d, m, y }
}

export const getDayString = (day, t, lang) => {
  const { d } = getdmy(t)
  if (lang === 'vi') {
    return d
  }
  if (lang === 'en') {
    if (day > 1) return d + 's'
    return d
  }
  return ''
}
