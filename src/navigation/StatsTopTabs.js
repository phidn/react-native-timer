import React from 'react'

import CalendarTrackerScreen from '@/screens/CalendarTrackerScreen'
import ChartScreen from '@/screens/ChartScreen'
import SessionStatsScreen from '@/screens/SessionStatsScreen'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'

const TopTab = createMaterialTopTabNavigator()

function StatsTopTabs() {
  const { t } = useTranslation()

  return (
    <TopTab.Navigator>
      <TopTab.Screen name={t('StatsTopTabs.calendar')} component={CalendarTrackerScreen} />
      <TopTab.Screen name={t('StatsTopTabs.chart')} component={ChartScreen} />
      <TopTab.Screen name={t('StatsTopTabs.session')} component={SessionStatsScreen} />
    </TopTab.Navigator>
  )
}

export default StatsTopTabs
