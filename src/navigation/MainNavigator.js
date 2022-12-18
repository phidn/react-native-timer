import React from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSettingScreen from '@screens/LanguageSettingScreen'
import MeditationTimerScreen from '@screens/MeditationTimerScreen'
import BottomTabNavigator from './BottomTabNavigator'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()

  const mainStackScreens = [
    {
      name: 'LanguageSettingScreen',
      component: LanguageSettingScreen,
      headerTitle: t('Settings.language'),
    },
    {
      name: 'MeditationTimerScreen',
      component: MeditationTimerScreen,
      headerTitle: t('Navigation.Screen.timer'),
    },
  ]

  return (
    <Stack.Navigator initialRouteName="BottomTabNavigator">
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      {mainStackScreens.map((stack) => (
        <Stack.Screen
          key={stack.name}
          name={stack.name}
          component={stack.component}
          options={{
            headerTitle: stack.headerTitle,
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        />
      ))}
    </Stack.Navigator>
  )
}

export default MainNavigator
