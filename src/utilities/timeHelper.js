import { range } from './commonHelper'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import isBetween from 'dayjs/plugin/isBetween'
import { logger } from './logger'
dayjs.extend(isBetween)

const HOUR = 60 * 60

const getHms = (t, length = 1) => {
  const hms = t('Time.hms').split('_')
  const h = hms[0].slice(0, length)
  const m = hms[1].slice(0, length)
  const s = hms[2].slice(0, length)

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

export const getCountdownV2 = (duration, t) => {
  const { h, m } = getHms(t, 3)

  const re = new RegExp(`\\b0${h}\\b`)

  return dayjs.duration(duration, 'seconds').format(`H[${h}] m[${m}]`).replace(re, '')
}

export const getInterval = (duration, t) => {
  const { m } = getHms(t)
  const result = dayjs.duration(duration, 'seconds').format(`m[${m}]`)
  return result === `0${m}` ? 'Silent' : result
}

export const getDuration = (duration, t) => {
  const { h, m } = getHms(t)
  const re = new RegExp(`\\b0${h}\\b`)

  return dayjs.duration(duration, 'seconds').format(`H[${h}] m[${m}]`).replace(re, '')
}

export const sToMs = (seconds) => seconds * 1000
export const sToMin = (seconds) => seconds / 60

export const isInWeek = (date) => {
  const startWeekDate = dayjs().day(0).format('YYYY-MM-DD')
  const endWeekDate = dayjs().day(6).format('YYYY-MM-DD')
  return dayjs(date).isBetween(startWeekDate, endWeekDate, 'day', '[]')
}

export const getWeekDates = () => {
  return range(0, 7).map((day) => dayjs().day(day).format('YYYY-MM-DD'))
}

/**
 * https://gist.github.com/miguelmota/7905510
 */
const getDates = (startDate, endDate) => {
  const dates = []
  let currentDate = startDate
  const addDays = function (days) {
    const date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
  }
  while (currentDate <= endDate) {
    dates.push(currentDate)
    currentDate = addDays.call(currentDate, 1)
  }
  return dates
}

/**
 * https://gist.github.com/miguelmota/7905510?permalink_comment_id=3971901#gistcomment-3971901
 */
export const rangeDates = (start, end, interval, asUnixTimestampsMS = false) => {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  const diffInUnits = endDate.diff(startDate, interval)
  return Array.from(Array(diffInUnits + 1).keys()).map((i) => {
    return asUnixTimestampsMS
      ? startDate.add(i, interval).valueOf()
      : startDate.add(i, interval).toDate()
  })
}

export const getMonthDates = () => {
  const start = dayjs().startOf('month').format('YYYY-MM-DD')
  const end = dayjs().endOf('month').format('YYYY-MM-DD')
  const dates = rangeDates(start, end, 'day')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getWeekDatesInMonth = () => {
  const start = dayjs().startOf('month').format('YYYY-MM-DD')
  const end = dayjs().endOf('month').format('YYYY-MM-DD')
  const dates = rangeDates(start, end, 'week')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getThreeMonthsDates = () => {
  const currentMonth = dayjs().month()
  const startOfPrevThreeMonths = dayjs().month(currentMonth - 3).endOf('month').format('YYYY-MM-DD')
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')
  
  const dates = rangeDates(startOfPrevThreeMonths, endOfCurrentMonth, 'day')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getMonthDatesInThreeMonths = () => {
  const currentMonth = dayjs().month()
  const startOfPrevThreeMonths = dayjs().month(currentMonth - 2).startOf('month').format('YYYY-MM-DD')
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')

  const dates = rangeDates(startOfPrevThreeMonths, endOfCurrentMonth, 'month')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getYearsDates = () => {
  const start = dayjs().startOf('year').format('YYYY-MM-DD')
  const end = dayjs().endOf('year').format('YYYY-MM-DD')
  const dates = rangeDates(start, end, 'day')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getMonthDatesInYear = () => {
  const start = dayjs().startOf('year').format('YYYY-MM-DD')
  const end = dayjs().endOf('year').format('YYYY-MM-DD')
  const dates = rangeDates(start, end, 'month')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const sortDates = (array) => {
  return array.sort((a, b) => {
    return dayjs(a).toDate().getTime() - dayjs(b).toDate().getTime()
  })
}
