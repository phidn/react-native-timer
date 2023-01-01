import { range } from './commonHelper'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)


export const getWeekDates = () => {
  return range(0, 7).map((day) => dayjs().day(day).format('YYYY-MM-DD'))
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

  // 2022-10-31
  const startOfPrevThreeMonths = dayjs()
    .month(currentMonth - 3)
    .endOf('month')
    .format('YYYY-MM-DD')

  // 2023-01-31
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')

  const dates = rangeDates(startOfPrevThreeMonths, endOfCurrentMonth, 'day')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getMonthDatesInThreeMonths = () => {
  const currentMonth = dayjs().month()
  const startOfPrevThreeMonths = dayjs()
    .month(currentMonth - 2)
    .startOf('month')
    .format('YYYY-MM-DD')
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')

  const dates = rangeDates(startOfPrevThreeMonths, endOfCurrentMonth, 'month')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getYearsDates = () => {
  const currentMonth = dayjs().month()
  const start = dayjs()
    .month(currentMonth - 12)
    .endOf('month')
    .format('YYYY-MM-DD')
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')

  const dates = rangeDates(start, endOfCurrentMonth, 'day')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const getMonthDatesInYear = () => {
  const currentMonth = dayjs().month()
  const startOfPrevThreeMonths = dayjs()
    .month(currentMonth - 11)
    .startOf('month')
    .format('YYYY-MM-DD')
  const endOfCurrentMonth = dayjs().month(currentMonth).endOf('month').format('YYYY-MM-DD')

  const dates = rangeDates(startOfPrevThreeMonths, endOfCurrentMonth, 'month')
  return dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
}

export const sortDates = (array) => {
  return array.sort((a, b) => {
    return dayjs(a).toDate().getTime() - dayjs(b).toDate().getTime()
  })
}
