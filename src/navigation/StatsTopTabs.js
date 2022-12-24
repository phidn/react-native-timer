import React from 'react'

import CalendarTrackerScreen from '@/screens/CalendarTrackerScreen'
import ChartScreen from '@/screens/ChartScreen'
import SessionStatsScreen from '@/screens/SessionStatsScreen'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/store/useStore'

const TopTab = createMaterialTopTabNavigator()

function StatsTopTabs() {
  const { t } = useTranslation()
  const statsTopInitTab = useStore((state) => state.statsTopInitTab)
  const setStatsTopInitTab = useStore((state) => state.setStatsTopInitTab)

  return (
    <TopTab.Navigator
      initialRouteName={t(statsTopInitTab)}
      screenListeners={() => ({
        state: (event) => {
          const { routeNames, index } = event.data.state
          setStatsTopInitTab(routeNames[index])
        },
      })}
    >
      <TopTab.Screen name={t('StatsTopTabs.calendar')} component={CalendarTrackerScreen} />
      <TopTab.Screen name={t('StatsTopTabs.chart')} component={ChartScreen} />
      <TopTab.Screen name={t('StatsTopTabs.session')} component={SessionStatsScreen} />
    </TopTab.Navigator>
  )
}

export default StatsTopTabs
