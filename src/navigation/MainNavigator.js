import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SettingsScreen from '@screens/SettingsScreen'
import PrepareScreen from '@screens/PrepareScreen'
import LanguageSettingScreen from '@screens/LanguageSettingScreen'
import AdminScreen from '@screens/AdminScreen'
import MeditationTimerScreen from '@screens/MeditationTimerScreen'
import logger from '@utilities/logger'
import StatsScreen from '@screens/StatsScreen'
import { useStore } from '@store/useStore'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()

  return (
    <Stack.Navigator initialRouteName="BottomTabNavigator">
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{
          headerTitleAlign: 'center',
          headerShown: true,
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen
        name="LanguageSettingScreen"
        component={LanguageSettingScreen}
        options={{
          headerTitle: t('Settings.language'),
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="MeditationTimerScreen"
        component={MeditationTimerScreen}
        options={{
          headerTitle: t('Navigation.Screen.timer'),
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  )
}

const TopTab = createMaterialTopTabNavigator()

function StatsTopTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Stats" component={StatsScreen} />
      <TopTab.Screen name="Admin" component={AdminScreen} />
    </TopTab.Navigator>
  )
}

const BottomTab = createMaterialBottomTabNavigator()

const BottomTabNavigator = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const { tertiary } = useTheme().colors

  const bottomTabRoutes = [
    {
      name: 'AdminTab',
      title: t('Navigation.BottomTab.AdminTab'),
      component: AdminScreen,
      IconComponent: Ionicons,
      icon: 'person',
      show: true,
    },
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

  const [isMounted, setIsMounted] = useState(false)
  const bottomActiveTab = useStore((state) => state.bottomActiveTab)
  const setBottomActiveTab = useStore((state) => state.setBottomActiveTab)

  useEffect(() => {
    if (bottomActiveTab && isMounted === false) {
      setIsMounted(true)
    }
  }, [bottomActiveTab, isMounted])

  useEffect(() => {
    if (bottomActiveTab) {
      navigation.setOptions({ title: t(`Navigation.BottomTab.${bottomActiveTab}`) })
    }
  }, [i18n.language, bottomActiveTab])

  return isMounted ? (
    <BottomTab.Navigator
      initialRouteName={bottomActiveTab}
      activeColor={tertiary}
      labeled={false}
      // style={{ height: 30, marginBottom: 20 }}
      // barStyle={{ height: 50, marginBottom: 50, overflow: 'hidden' }}
      // shifting={false}
      // sceneAnimationEnabled={false}
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
                style={{ marginBottom: 0 }}
              />
            ),
            tabBarBadge: bottomTabRoute.name === bottomActiveTab,
          }}
        />
      ))}
    </BottomTab.Navigator>
  ) : null
}

export default MainNavigator
