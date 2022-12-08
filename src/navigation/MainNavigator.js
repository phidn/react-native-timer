import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useTheme } from 'react-native-paper'
import ScreenOne from '@screens/ScreenOne'
import ScreenTwo from '@screens/ScreenTwo'

const Stack = createNativeStackNavigator()

const MainNavigator = () => {
  const theme = useTheme()
  
  return (
    <Stack.Navigator>
      <Stack.Screen name="ScreenOne" component={ScreenOne} />
      <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
    </Stack.Navigator>
  )
}

export default MainNavigator
