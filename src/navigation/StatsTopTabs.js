import React from 'react'
import CalendarTrackerScreen from '@screens/CalendarTrackerScreen'
import ChartScreen from '@screens/ChartScreen'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
const TopTab = createMaterialTopTabNavigator()

function StatsTopTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Calendar Tracker" component={CalendarTrackerScreen} />
      <TopTab.Screen name="Chart" component={ChartScreen} />
    </TopTab.Navigator>
  )
}

export default StatsTopTabs
