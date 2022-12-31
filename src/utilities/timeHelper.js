import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)

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

export const sToMs = (seconds) => seconds * 1000
export const sToMin = (seconds) => seconds / 60

export const getMinText = (minNumber, lang) => {
  const minText = dayjs.duration(1, 'minute').locale(lang).humanize().split(' ').pop()
  const minsText = dayjs.duration(2, 'minute').locale(lang).humanize().split(' ').pop()

  if (minNumber <= 1) return minText
  if (minNumber > 1) return minsText
}

export const getDayText = (dayNumber, lang) => {
  const dayText = dayjs.duration(1, 'day').locale(lang).humanize().split(' ').pop()
  const daysText = dayjs.duration(2, 'day').locale(lang).humanize().split(' ').pop()

  if (dayNumber <= 1) return dayText
  if (dayNumber > 1) return daysText
}

export const getDMYFirstChar = (lang) => {
  const dayText = dayjs.duration(1, 'day').locale(lang).humanize().split(' ').pop()
  const monthText = dayjs.duration(1, 'month').locale(lang).humanize().split(' ').pop()
  const yearText = dayjs.duration(1, 'year').locale(lang).humanize().split(' ').pop()

  return [dayText, monthText, yearText].map((x) => x.charAt(0).toUpperCase())
}
