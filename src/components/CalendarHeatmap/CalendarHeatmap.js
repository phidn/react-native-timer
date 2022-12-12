import React, { useState, useEffect, useMemo } from 'react'
import { ScrollView } from 'react-native'
import Svg, { G, Rect, Text } from 'react-native-svg'
import {
  SQUARE_SIZE,
  DAYS_IN_WEEK,
  MONTH_LABEL_GUTTER_SIZE,
  MILLISECONDS_IN_ONE_DAY,
} from './constants'
import {
  shiftDate,
  getWeekCount,
  getStartDateWithEmptyDays,
  getMonthLabelCoordinates,
  getTransformForWeek,
  getNumEmptyDaysAtStart,
  getSquareCoordinates,
  getTitleForIndex,
  getFillColor,
  getTooltipDataAttrsForIndex,
  getHeight,
  getWidth,
  getValueCache,
} from './utils'
import logger from '@utilities/logger'
import { useTranslation } from 'react-i18next'
import { range } from '@utilities/commonHelper'

const CalendarHeatmap = (props) => {
  const {
    values,
    gutterSize,
    horizontal,
    numDays,
    endDate,
    titleForValue,
    tooltipDataAttrs,
    onPress,
    showOutOfRangeDays,
    labelColor,
    showMonthLabels,
    monthLabelForIndex,
    colorArray,
    showWeekdayLabels,
  } = props

  const { t } = useTranslation()

  const monthsShort = t('Time.months-short').split('_')
  const monthLabels = { ...monthsShort }

  const weekdaysShort = t('Time.weekdays-short').split('_')

  const valueCache = useMemo(
    () => getValueCache(values, numDays, endDate),
    [values, numDays, endDate]
  )

  const handleClick = (value) => {
    if (onPress) {
      onPress(value)
    }
  }

  const renderSquare = (dayIndex, index) => {
    const indexOutOfRange =
      index < getNumEmptyDaysAtStart(numDays, endDate) ||
      index >= getNumEmptyDaysAtStart(numDays, endDate) + numDays
    if (indexOutOfRange && !showOutOfRangeDays) {
      return null
    }
    const [x, y] = getSquareCoordinates(dayIndex, horizontal, gutterSize)
    const fillColor = getFillColor(index, valueCache, colorArray)

    return (
      <Rect
        key={index}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
        x={x}
        y={y}
        title={getTitleForIndex(index, valueCache, titleForValue)}
        onPress={() => handleClick(index)}
        fill={fillColor}
        {...getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs)}
      />
    )
  }

  const renderWeek = (weekIndex) => {
    const [x, y] = getTransformForWeek(weekIndex, horizontal, gutterSize, showMonthLabels)
    return (
      <G key={weekIndex} x={x} y={y}>
        {range(DAYS_IN_WEEK).map((dayIndex) =>
          renderSquare(dayIndex, weekIndex * DAYS_IN_WEEK + dayIndex)
        )}
      </G>
    )
  }

  const renderAllWeeks = () => {
    return range(getWeekCount(numDays, endDate)).map((weekIndex) => renderWeek(weekIndex))
  }

  const renderMonthLabels = () => {
    if (!showMonthLabels) {
      return null
    }

    // don't render for last week, because label will be cut off
    const weekRange = range(getWeekCount(numDays, endDate) - 1)

    return weekRange.map((weekIndex) => {
      const endOfWeek = shiftDate(
        getStartDateWithEmptyDays(numDays, endDate),
        (weekIndex + 1) * DAYS_IN_WEEK
      )
      const [x, y] = getMonthLabelCoordinates(weekIndex, horizontal, gutterSize)
      return endOfWeek.getDate() >= 1 && endOfWeek.getDate() <= DAYS_IN_WEEK ? (
        <Text key={weekIndex} x={x} y={y + 20} fill={labelColor}>
          {monthLabelForIndex
            ? monthLabelForIndex(endOfWeek.getMonth())
            : monthLabels[endOfWeek.getMonth()]}
        </Text>
      ) : null
    })
  }

  const getWeekdayLabelCoordinates = (dayIndex) => {
    if (horizontal) {
      return [
        0,
        (dayIndex + 1) * SQUARE_SIZE +
          dayIndex * gutterSize +
          SQUARE_SIZE +
          MONTH_LABEL_GUTTER_SIZE,
      ]
    }
    return [dayIndex * SQUARE_SIZE + dayIndex * gutterSize, SQUARE_SIZE]
  }

  const renderWeekdayLabels = () => {
    if (!showWeekdayLabels) {
      return null
    }
    return weekdaysShort.map((weekdayLabel, dayIndex) => {
      const [x, y] = getWeekdayLabelCoordinates(dayIndex)

      return dayIndex & 1 ? (
        <Text key={`${x}${y}`} x={x} y={y - 6} fill={labelColor}>
          {weekdayLabel}
        </Text>
      ) : null
    })
  }

  const width = getWidth(numDays, endDate, gutterSize)
  const height = getHeight(gutterSize, showMonthLabels, horizontal)

  return (
    <ScrollView>
      <Svg width={width + 65} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G>{renderMonthLabels()}</G>
        <G>{renderAllWeeks()}</G>
        <G translateX={-30}>{renderWeekdayLabels()}</G>
      </Svg>
    </ScrollView>
  )
}

CalendarHeatmap.defaultProps = {
  numDays: 200,
  endDate: new Date(),
  gutterSize: 1,
  horizontal: true,
  showMonthLabels: true,
  showOutOfRangeDays: false,
  showWeekdayLabels: true,
}

export default CalendarHeatmap
