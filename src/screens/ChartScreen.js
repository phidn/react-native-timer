import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { BarChart, LineChart, XAxis, Grid, YAxis } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import PageContainer from '@/components/Containers/PageContainer'
import { SegmentedButtons, useTheme } from 'react-native-paper'
import { useStore } from '@/store/useStore'
import { logger } from '@/utilities/logger'
import dayjs from 'dayjs'
import {
  getWeekDates,
  getMonthDates,
  rangeDates,
  getWeekDatesInMonth,
  getThreeMonthsDates,
  getMonthDatesInThreeMonths,
  getYearsDates,
  getMonthDatesInYear,
  sortDates,
} from '@/utilities/timeHelper'
import { calcTotalTime } from '@/utilities/sessionHelper'
import { Text as TextPaper } from 'react-native-paper'
import * as scale from 'd3-scale'
import Color from 'color'

// 7 days
const weekDates = getWeekDates()

// 1 month
const monthDates = getMonthDates()
const weekDatesInMonth = getWeekDatesInMonth()

// 3 months
const threeMonthsDates = getThreeMonthsDates()
const monthDatesInThreeMonths = getMonthDatesInThreeMonths()

// 1 year
const yearDates = getYearsDates()
const monthDatesInYear = getMonthDatesInYear()

const ChartScreen = () => {
  const { colors } = useTheme()

  const chartType = useStore((state) => state.chartType)
  const setChartType = useStore((state) => state.setChartType)

  const [data, setData] = useState([])

  const [dataAllChart, setDataAllChart] = useState({
    '7d': [],
    '1m': [],
    '3m': [],
    '1y': [],
    all: [],
  })
  const [datesInAll, setDatesInAll] = useState([])
  const [yearInAll, setYearInAll] = useState([])

  const sessions = useStore((state) => state.sessions)

  useEffect(() => {
    setDataAllChart({
      '7d': getChartData('7d'),
      '1m': getChartData('1m'),
      '3m': getChartData('3m'),
      '1y': getChartData('1y'),
      all: getChartData('all'),
    })

    // Get years in all session
    const sessionDates = Object.keys(sessions)
    const sortSessionDates = sortDates(sessionDates)
    const start = sortSessionDates[0]
    const end = sortSessionDates[sortSessionDates.length - 1]
    const years = rangeDates(start, end, 'year').map((date) => dayjs(date).format('YYYY-MM-DD'))
    setYearInAll(years)

    // Get dates in all session
    const _datesInAll = rangeDates(start, end, 'day').map((date) =>
      dayjs(date).format('YYYY-MM-DD')
    )
    setDatesInAll(_datesInAll)
  }, [sessions])

  const getChartData = (_chartType) => {
    let dates = []
    switch (_chartType) {
      case '7d':
        dates = weekDates
        break
      case '1m':
        dates = monthDates
        break
      case '3m':
        dates = threeMonthsDates
        break
      case '1y':
        dates = yearDates
        break
      case 'all': {
        const sessionDates = Object.keys(sessions)
        const sortSessionDates = sortDates(sessionDates)

        const start = sortSessionDates[0]
        const end = sortSessionDates[sortSessionDates.length - 1]
        dates = rangeDates(start, end, 'day').map((date) => dayjs(date).format('YYYY-MM-DD'))
      }
    }

    if (dates.length) {
      const chartData = dates.map((date) => {
        const value = calcTotalTime(sessions[date])
        return value
      })
      return chartData
    }
    return []
  }

  useEffect(() => {
    const _chartData = dataAllChart[chartType]
    if (_chartData.length) {
      setData(_chartData)
    }
  }, [dataAllChart, chartType])

  const formatLabelXAxis = (value, index) => {
    if (chartType === '7d') {
      return dayjs(weekDates[index]).format('DD')
    }
    if (chartType === '1m') {
      if (weekDatesInMonth.indexOf(monthDates[index]) !== -1) {
        return dayjs(monthDates[index]).format('DD')
      }
    }
    if (chartType === '3m') {
      if (monthDatesInThreeMonths.indexOf(threeMonthsDates[index]) !== -1) {
        return dayjs(threeMonthsDates[index]).format('MM')
      }
    }
    if (chartType === '1y') {
      if (monthDatesInYear.indexOf(yearDates[index]) !== -1) {
        return dayjs(yearDates[index]).format('MM')
      }
    }
    if (chartType === 'all') {
      if (yearInAll.indexOf(datesInAll[index]) !== -1) {
        return dayjs(datesInAll[index]).format('YYYY')
      }
    }
  }

  const axesSvg = { fontSize: 10, fill: colors.onSurface }
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30

  return (
    <PageContainer paddingHorizontal={30}>
      <SafeAreaView style={styles.segmentedButtonsContainer}>
        <SegmentedButtons
          value={chartType}
          onValueChange={setChartType}
          density="small"
          buttons={[
            {
              value: '7d',
              label: '7D',
            },
            {
              value: '1m',
              label: '1M',
            },
            {
              value: '3m',
              label: '3M',
            },
            {
              value: '1y',
              label: '1Y',
            },
            {
              value: 'all',
              label: '∞',
            },
          ]}
        />
      </SafeAreaView>
      <View style={{ height: 250, flexDirection: 'row' }}>
        <YAxis
          data={data}
          style={{ marginBottom: xAxisHeight }}
          contentInset={verticalContentInset}
          svg={axesSvg}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <BarChart
            style={{ flex: 1 }}
            data={data}
            svg={{ fill: colors.tertiary }}
            contentInset={verticalContentInset}
            spacing={0.2}
            gridMin={0}
          >
            <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: colors.outlineVariant }} />
          </BarChart>
          <XAxis
            style={{ marginHorizontal: -10, height: xAxisHeight }}
            data={data}
            scale={scale.scaleBand}
            formatLabel={formatLabelXAxis}
            contentInset={{ left: 10, right: 10 }}
            svg={axesSvg}
          />
        </View>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  segmentedButtonsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chartContainer: {
    height: 250,
  },
  week: {
    flexDirection: 'row',
  },
})

export default ChartScreen
