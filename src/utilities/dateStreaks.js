function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument)
  if (argument instanceof Date || (typeof argument === 'object' && argStr === '[object Date]')) {
    return new argument.constructor(argument.getTime())
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument)
  } else {
    return new Date(NaN)
  }
}

function startOfDay(dirtyDate) {
  const date = toDate(dirtyDate)
  date.setHours(0, 0, 0, 0)
  return date
}

const subDays = (date, d) => {
  date.setDate(date.getDate() - d)
  return date
}

const addDays = (date, d) => {
  date.setDate(date.getDate() + d)
  return date
}

const isValid = (date) => {
  return !isNaN((date instanceof Date ? date : new Date(date)).getTime())
}

const differenceInDays = (dateA, dateB) => {
  return Math.round((dateA - dateB) / (1000 * 60 * 60 * 24))
}

const relativeDates = () => ({
  today: startOfDay(new Date()),
  yesterday: startOfDay(subDays(new Date(), 1)),
  tomorrow: startOfDay(addDays(new Date(), 1)),
})

const filterInvalidDates = (dates) =>
  dates.filter((date) =>
    !isValid(new Date(date))
      ? console.error(
          `The date '${date}' is not in a valid date format and date-streaks is ignoring it. Browsers do not consistently support this and this package's results may fail. Verify the array of dates you're passing to date-streaks are all valid date strings. http://momentjs.com/docs/#/parsing/string/`
        )
      : new Date(date)
  )

const sortDates = (dates) => {
  return dates
    .sort(function (a, b) {
      return startOfDay(b) - startOfDay(a)
    })
    .reverse()
}

const getDatesParameter = (param = {}) => {
  if (Array.isArray(param)) {
    return param
  } else {
    const { dates } = param
    return dates || []
  }
}

function summary(datesParam = []) {
  const dates = getDatesParameter(datesParam)
  const { today, yesterday } = relativeDates()
  const allDates = filterInvalidDates(dates)
  const sortedDates = sortDates(allDates)

  const result = sortedDates.reduce(
    (acc, date, index) => {
      const first = new Date(date)
      const second = sortedDates[index + 1] ? new Date(sortedDates[index + 1]) : first
      const diff = differenceInDays(second, first)
      const isToday = acc.isToday || differenceInDays(date, today) === 0
      const isYesterday = acc.isYesterday || differenceInDays(date, yesterday) === 0
      const isInFuture = acc.isInFuture || differenceInDays(today, date) < 0

      if (diff === 0) {
        if (isToday) {
          acc.todayInStreak = true
        }
      } else {
        diff === 1 ? ++acc.streaks[acc.streaks.length - 1] : acc.streaks.push(1)
      }

      return {
        ...acc,
        longestStreak: Math.max(...acc.streaks),
        withinCurrentStreak:
          acc.isToday || acc.isYesterday || acc.isInFuture || isToday || isYesterday || isInFuture,
        currentStreak:
          isToday || isYesterday || isInFuture ? acc.streaks[acc.streaks.length - 1] : 0,
        isInFuture,
        isYesterday,
        isToday,
      }
    },
    {
      currentStreak: 0,
      longestStreak: 0,
      streaks: [1],
      todayInStreak: false,
      withinCurrentStreak: false,
      isInFuture: false,
      isToday: false,
      isYesterday: false,
    }
  )

  const { isToday, isYesterday, isInFuture, ...rest } = result

  return rest
}

export default summary
