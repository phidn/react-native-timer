import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, View } from 'react-native'
import { BarChart, LineChart, XAxis, Grid, YAxis } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import PageContainer from '@/components/Containers/PageContainer'
import { Card, SegmentedButtons, useTheme } from 'react-native-paper'
import { useStore } from '@/store/useStore'
import { logger } from '@/utilities/logger'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

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
import CenterContainer from '@/components/Containers/CenterContainer'
import { useTranslation } from 'react-i18next'

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
  const { t, i18n } = useTranslation()

  const [dayString, monthString, yearString] = t('Time.DMS').split('_').map(x => x.charAt(0))

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

  const renderRangeDates = () => {
    let _dayjs, formatDate = 'MMMM DD, YYYY', result
    if (i18n.resolvedLanguage === 'vi') {
      _dayjs = (param) => dayjs(param).locale('vi')
      formatDate = 'DD MMMM, YYYY'
    }

    if (chartType === '7d') {
      const start = _dayjs().day(0).format(formatDate)
      const end = _dayjs().day(7).format(formatDate)
      result = `${start} - ${end}`
    }
    if (chartType === '1m') {
      const start = _dayjs().startOf('month').format(formatDate)
      const end = _dayjs().endOf('month').format(formatDate)
      result = `${start} - ${end}`
    }
    if (chartType === '3m') {
      const currentMonth = _dayjs().month()
      const start = _dayjs()
        .month(currentMonth - 3)
        .endOf('month')
        .format(formatDate)
      const end = _dayjs().month(currentMonth).endOf('month').format(formatDate)

      result = `${start} - ${end}`
    }
    if (chartType === '1y') {
      const start = _dayjs().startOf('year').format(formatDate)
      const end = _dayjs().endOf('year').format(formatDate)
      result = `${start} - ${end}`
    }
    if (chartType === 'all') {
      const start = _dayjs(datesInAll[0]).format(formatDate)
      const end = _dayjs(datesInAll[datesInAll.length - 1]).format(formatDate)
      result = `${start} - ${end}`
    }
    
    if (i18n.resolvedLanguage === 'vi') {
      result = result.replace(/tháng/g, 'Tháng')
    }

    return result
  }

  const axesSvg = { fontSize: 10, fill: Color(colors.onSurface).alpha(0.5).toString() }
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30

  return (
    <PageContainer style={{ padding: 20, paddingTop: 30 }}>
      <SafeAreaView style={{ alignItems: 'center', marginBottom: 20 }}>
        <SegmentedButtons
          value={chartType}
          onValueChange={setChartType}
          density="small"
          buttons={[
            {
              value: '7d',
              label: '7' + dayString,
            },
            {
              value: '1m',
              label: '1' + monthString,
            },
            {
              value: '3m',
              label: '3' + monthString,
            },
            {
              value: '1y',
              label: '1' + yearString,
            },
            {
              value: 'all',
              label: '∞',
            },
          ]}
        />
      </SafeAreaView>

      <CenterContainer>
        <TextPaper variant="titleLarge">{t('Statistics.Chart.daily-meditation')}</TextPaper>
      </CenterContainer>
      <CenterContainer style={{ marginBottom: 10 }}>
        <TextPaper>{renderRangeDates()}</TextPaper>
      </CenterContainer>

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

export default ChartScreen
