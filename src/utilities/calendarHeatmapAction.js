import {
  SQUARE_SIZE,
  DAYS_IN_WEEK,
  MONTH_LABEL_GUTTER_SIZE,
  MILLISECONDS_IN_ONE_DAY,
} from '@config/calendarHeatmap'

const getValueCache = (values, numDays, endDate) => {
  return values.reduce((memo, value) => {
    const date = convertToDate(value.date)
    const heatmapIndex = Math.floor(
      (date - getStartDateWithEmptyDays(numDays, endDate)) / MILLISECONDS_IN_ONE_DAY
    )
    memo[heatmapIndex] = {
      value: value,
    }

    return memo
  }, {})
}

// returns a new date shifted a certain number of days (can be negative)
function shiftDate(date, numDays) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + numDays)
  return newDate
}
function getBeginningTimeForDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
// obj can be a parseable string, a millisecond timestamp, or a Date object
function convertToDate(obj) {
  return obj instanceof Date ? obj : new Date(obj)
}

function getWeekWidth(gutterSize) {
  return DAYS_IN_WEEK * getSquareSizeWithGutter(gutterSize)
}

function getWidth(numDays, endDate, gutterSize) {
  return getWeekCount(numDays, endDate) * getSquareSizeWithGutter(gutterSize) - gutterSize
}

function getHeight(gutterSize, showMonthLabels, horizontal, showWeekdayLabels) {
  return getWeekWidth(gutterSize) + (getMonthLabelSize(showMonthLabels, horizontal) - gutterSize)
}

function getTooltipDataAttrsForValue(value, tooltipDataAttrs) {
  if (typeof tooltipDataAttrs === 'function') return tooltipDataAttrs(value)
  return tooltipDataAttrs
}

function getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs) {
  if (valueCache[index]) {
    return valueCache[index].tooltipDataAttrs
  }
  return getTooltipDataAttrsForValue({ date: null, count: null }, tooltipDataAttrs)
}

function getCountByDuplicateValues(array) {
  let hashMap = {}

  for (var item of array) {
    //if that date exists
    if (item.date in hashMap) {
      //up the prev count
      hashMap[item.date] = hashMap[item.date] + 1
    } else {
      hashMap[item.date] = 1
    }
  }

  //now we will iterate through those keys of the Map and format it for Array 2
  let outputArray = []
  Object.keys(hashMap).forEach((key) => {
    outputArray.push({
      key,
      count: hashMap[key],
    })
  })
  return outputArray
}

function findColorLevel(count, rectColor) {
  if (count === 0) return rectColor[0]
  if (count >= 1 && count <= 3) return rectColor[1]
  if (count >= 4 && count <= 9) return rectColor[2]
  if (count >= 10 && count <= 17) return rectColor[3]
  if (count >= 18 && count <= 25) return rectColor[4]
  if (count >= 26) return rectColor[5]
  return rectColor[0]
}

function getFillColor(index, valueCache, rectColor) {
  if (valueCache[index]) {
    const fillColor = findColorLevel(valueCache[index].value.count, rectColor)
    return fillColor
  }
  return rectColor[0]
}

function getTitleForIndex(index, valueCache, titleForValue) {
  if (valueCache[index]) return valueCache[index].title
  return titleForValue ? titleForValue(null) : null
}

function getSquareCoordinates(dayIndex, horizontal, gutterSize) {
  if (horizontal) return [0, dayIndex * getSquareSizeWithGutter(gutterSize)]
  return [dayIndex * getSquareSizeWithGutter(gutterSize), 0]
}

function getTransformForWeek(weekIndex, horizontal, gutterSize, showMonthLabels) {
  if (horizontal) {
    return [
      weekIndex * getSquareSizeWithGutter(gutterSize),
      getMonthLabelSize(showMonthLabels, horizontal),
    ]
  }
  if (horizontal && !showMonthLabels) {
    return [weekIndex * getSquareSizeWithGutter(gutterSize), 0]
  }
  return [10, weekIndex * getSquareSizeWithGutter(gutterSize)]
}

function getMonthLabelSize(showMonthLabels, horizontal) {
  if (!showMonthLabels) {
    return 0
  } else if (horizontal) {
    return SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE
  }
  return 2 * (SQUARE_SIZE + MONTH_LABEL_GUTTER_SIZE)
}

function getSquareSizeWithGutter(gutterSize) {
  return SQUARE_SIZE + gutterSize
}

function getMonthLabelCoordinates(weekIndex, horizontal, gutterSize) {
  if (horizontal) {
    return [weekIndex * getSquareSizeWithGutter(gutterSize), 0]
  }
  const verticalOffset = -2
  return [0, (weekIndex + 1) * getSquareSizeWithGutter(gutterSize) + verticalOffset]
}

function getStartDateWithEmptyDays(numDays, endDate) {
  return shiftDate(getStartDate(numDays, endDate), -getNumEmptyDaysAtStart(numDays, endDate))
}

function getEndDate(endDate) {
  return getBeginningTimeForDate(convertToDate(endDate))
}

function getStartDate(numDays, endDate) {
  return shiftDate(getEndDate(endDate), -numDays + 1) // +1 because endDate is inclusive
}

function getNumEmptyDaysAtEnd(endDate) {
  return DAYS_IN_WEEK - 1 - getEndDate(endDate).getDay()
}

function getNumEmptyDaysAtStart(numDays, endDate) {
  return getStartDate(numDays, endDate).getDay()
}

function getWeekCount(numDays, endDate) {
  const numDaysRoundedToWeek =
    numDays + getNumEmptyDaysAtStart(numDays, endDate) + getNumEmptyDaysAtEnd(endDate)
  return Math.ceil(numDaysRoundedToWeek / DAYS_IN_WEEK)
}

export {
  shiftDate,
  getBeginningTimeForDate,
  convertToDate,
  getWeekCount,
  getStartDateWithEmptyDays,
  getMonthLabelCoordinates,
  getTransformForWeek,
  getNumEmptyDaysAtStart,
  getSquareCoordinates,
  getTitleForIndex,
  getFillColor,
  getCountByDuplicateValues,
  getTooltipDataAttrsForIndex,
  getTooltipDataAttrsForValue,
  getHeight,
  getWidth,
  getValueCache,
}
