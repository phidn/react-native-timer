import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './MainNavigator'

const AppNavigator = ({ theme }) => {
  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <MainNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator
