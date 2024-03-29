import React, { useEffect } from 'react'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SettingsScreen from '@/screens/SettingsScreen'
import PrepareScreen from '@/screens/PrepareScreen'
import StatsTopTabs from './StatsTopTabs'

import { useStore } from '@/store/useStore'
import useHydration from '@/hooks/useHydration'
import useIsReady from '@/hooks/useIsReady'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
const BottomTab = createMaterialBottomTabNavigator()

const BottomTabNavigator = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const { tertiary } = useTheme().colors

  const bottomTabRoutes = [
    {
      name: 'PrepareTab',
      title: t('Navigation.BottomTab.PrepareTab'),
      component: PrepareScreen,
      IconComponent: Ionicons,
      icon: 'heart',
      show: true,
    },
    {
      name: 'StatsTab',
      title: t('Navigation.BottomTab.StatsTab'),
      component: StatsTopTabs,
      IconComponent: MaterialCommunityIcons,
      icon: 'chart-box',
      show: true,
    },
    {
      name: 'SettingsTab',
      title: t('Navigation.BottomTab.SettingsTab'),
      component: SettingsScreen,
      IconComponent: Ionicons,
      icon: 'settings',
      show: true,
    },
  ].filter((x) => x.show)

  const bottomActiveTab = useStore((state) => state.bottomActiveTab)
  const setBottomActiveTab = useStore((state) => state.setBottomActiveTab)
  const hydrated = useHydration()
  const isReady = useIsReady(hydrated, bottomActiveTab)

  useEffect(() => {
    if (bottomActiveTab) {
      navigation.setOptions({ title: t(`Navigation.BottomTab.${bottomActiveTab}`) })
    }
  }, [i18n.language, bottomActiveTab])

  return isReady ? (
    <BottomTab.Navigator
      initialRouteName={bottomActiveTab}
      activeColor={tertiary}
      labeled={false}
      screenListeners={() => ({
        state: (event) => {
          const { routeNames, index } = event.data.state
          setBottomActiveTab(routeNames[index])
        },
      })}
    >
      {bottomTabRoutes.map((bottomTabRoute) => (
        <BottomTab.Screen
          key={bottomTabRoute.name}
          name={bottomTabRoute.name}
          component={bottomTabRoute.component}
          options={{
            title: bottomTabRoute.title,
            tabBarLabel: bottomTabRoute.title,
            tabBarIcon: ({ focused, color }) => (
              <bottomTabRoute.IconComponent
                name={focused ? bottomTabRoute.icon : `${bottomTabRoute.icon}-outline`}
                size={26}
                color={color}
              />
            ),
            tabBarBadge: bottomTabRoute.name === bottomActiveTab,
          }}
        />
      ))}
    </BottomTab.Navigator>
  ) : null
}

export default BottomTabNavigator
