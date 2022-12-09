import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ScreenOne from '@screens/ScreenOne'
import ScreenTwo from '@screens/ScreenTwo'
import ScreenThree from '@screens/ScreenThree'
import ScreenFour from '@screens/ScreenFour'
import AdminScreen from '@screens/AdminScreen'
import NavigationBar from '@components/NavigationBar/NavigationBar'
import SettingsScreen from '@screens/SettingsScreen'

const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  const theme = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="BottomTabNavigator"
      screenOptions={{
        header: (props) => <NavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ScreenOne" component={ScreenOne} />
      <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
    </Stack.Navigator>
  )
}

const Tab = createMaterialBottomTabNavigator()

const BottomTabNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { tertiary } = theme.colors

  return (
    <Tab.Navigator initialRouteName="Preset" activeColor={tertiary}>
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          title: 'Admin',
          tabBarLabel: 'Admin',
          headerTitleAlign: 'center',
          // headerTransparent: true,
          // headerShadowVisible: false,
          // headerTitleStyle: { color: onPrimary },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScreenThree"
        component={ScreenThree}
        options={{
          title: t('Navigation.BottomTabNavigator.TabScreen.preset'),
          tabBarLabel: t('Navigation.BottomTabNavigator.TabScreen.preset'),
          headerTitleAlign: 'center',
          // headerTransparent: true,
          // headerShadowVisible: false,
          // headerTitleStyle: { color: onPrimary },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: t('Navigation.BottomTabNavigator.TabScreen.settings'),
          tabBarLabel: t('Navigation.BottomTabNavigator.TabScreen.settings'),
          headerTitleAlign: 'center',
          // headerTransparent: true,
          // headerShadowVisible: false,
          // headerTitleStyle: { color: onPrimary },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
