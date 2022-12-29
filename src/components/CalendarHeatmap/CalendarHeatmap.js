import React from 'react'
import { ScrollView, View } from 'react-native'
import Svg, { G, Rect, Text } from 'react-native-svg'
import { SQUARE_SIZE, DAYS_IN_WEEK, MONTH_LABEL_GUTTER_SIZE, COLOR_LEVELS } from '@/config/calendarHeatmap'

import {
  shiftDate,
  getWeekCount,
  getStartDateWithEmptyDays,
  getMonthLabelCoordinates,
  getTransformForWeek,
  getNumEmptyDaysAtStart,
  getSquareCoordinates,
  getTitleForIndex,
  getTooltipDataAttrsForIndex,
  getHeight,
  getWidth,
  getValueCache,
} from '@/utilities/calendarHeatmapAction'

import { useTranslation } from 'react-i18next'
import { range } from '@/utilities/commonHelper'
import { useTheme } from 'react-native-paper'
import Color from 'color'

const CalendarHeatmap = (props) => {
  const {
    values,
    gutterSize,
    horizontal,
    numDays,
    endDate,
    titleForValue,
    tooltipDataAttrs,
    showOutOfRangeDays,
    showMonthLabels,
    monthLabelForIndex,
    showWeekdayLabels,
  } = props

  const { t } = useTranslation()
  const { colors, dark } = useTheme()
  
  const colorArray = COLOR_LEVELS
  const labelColor = colors.onSurface
  const bgColor = dark
    ? Color(colors.surfaceVariant).alpha(0.3).toString()
    : Color(colors.surfaceVariant).alpha(0.5).toString()
  const borderColor = Color.rgb(255, 255, 255).alpha(0.05).toString()

  const monthsShort = t('Time.months-short').split('_')
  const monthLabels = { ...monthsShort }
  const weekdaysShort = t('Time.weekdays-short')
    .split('_')
    .map((x) => x.slice(0, 2))
  const valueCache = getValueCache(values, numDays, endDate)

  const findColorLevel = (percent) => {
    if (percent > 0 && percent <= 40) return colorArray[0]
    if (percent > 40 && percent < 60) return colorArray[1]
    if (percent >= 60 && percent < 80) return colorArray[2]
    if (percent > 80) return colorArray[3]
    return bgColor
  }

  const renderSquare = (dayIndex, index) => {
    const indexOutOfRange =
      index < getNumEmptyDaysAtStart(numDays, endDate) ||
      index >= getNumEmptyDaysAtStart(numDays, endDate) + numDays
    if (indexOutOfRange && !showOutOfRangeDays) {
      return null
    }
    const [x, y] = getSquareCoordinates(dayIndex, horizontal, gutterSize)
    const fillColor = findColorLevel(valueCache[index]?.value?.percent)

    let stroke = valueCache[index]?.value?.count === -1? colorArray[1]: null
    stroke = stroke === null && fillColor !== bgColor? borderColor: stroke

    return (
      <Rect
        key={index}
        width={SQUARE_SIZE}
        height={SQUARE_SIZE}
        x={x}
        y={y}
        title={getTitleForIndex(index, valueCache, titleForValue)}
        fill={fillColor}
        {...getTooltipDataAttrsForIndex(index, valueCache, tooltipDataAttrs)}
        stroke={stroke}
        rx={1}
        ry={1}
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
        <Text key={weekIndex} x={x} y={y + 15} fill={labelColor}>
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
        <Text key={`${x}${y}`} x={x} y={y - 4} fill={labelColor} textAnchor="end">
          {weekdayLabel}
        </Text>
      ) : null
    })
  }

  const width = getWidth(numDays, endDate, gutterSize)
  const height = getHeight(gutterSize, showMonthLabels, horizontal)

  return (
    <View>
      <Svg width={width + 40} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G translateX={15}>{renderMonthLabels()}</G>
        <G translateX={15}>{renderAllWeeks()}</G>
        <G translateX={5}>{renderWeekdayLabels()}</G>
      </Svg>
    </View>
  )
}

CalendarHeatmap.defaultProps = {
  numDays: 91,
  endDate: new Date(),
  gutterSize: 1,
  horizontal: true,
  showMonthLabels: true,
  showOutOfRangeDays: false,
  showWeekdayLabels: true,
}

export default CalendarHeatmap
