import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import SettingsScreen from '@screens/SettingsScreen'
import PrepareScreen from '@screens/PrepareScreen'
import LanguageSettingScreen from '@screens/LanguageSettingScreen'
import AdminScreen from '@screens/AdminScreen'

const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  const { t } = useTranslation()
  const { onPrimary } = useTheme().colors

  return (
    <Stack.Navigator initialRouteName="BottomTabNavigator">
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerShadowVisible: false,
          headerTitleStyle: { color: onPrimary },
        }}
      />
      <Stack.Screen
        name="LanguageSettingScreen"
        component={LanguageSettingScreen}
        options={{
          headerTitle: t('Settings.language'),
          headerShown: true,
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerShadowVisible: false,
          headerTitleStyle: { color: onPrimary },
          headerTintColor: onPrimary
        }}
      />
    </Stack.Navigator>
  )
}

const Tab = createMaterialBottomTabNavigator()

const BottomTabNavigator = ({ navigation }) => {
  const { t } = useTranslation()
  const { tertiary } = useTheme().colors

  return (
    <Tab.Navigator
      initialRouteName="PrepareTab"
      activeColor={tertiary}
      screenListeners={() => ({
        state: (e) => {
          const { routeNames, index } = e.data.state
          const activeTab = routeNames[index]
          navigation.setOptions({ title: t(`Navigation.BottomTab.${activeTab}`) })
        },
      })}
    >
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          title: 'Admin',
          tabBarLabel: 'Admin',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PrepareTab"
        component={PrepareScreen}
        options={{
          title: t('Navigation.BottomTab.PrepareTab'),
          tabBarLabel: t('Navigation.BottomTab.PrepareTab'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: t('Navigation.BottomTab.SettingsTab'),
          tabBarLabel: t('Navigation.BottomTab.SettingsTab'),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
