import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './MainNavigator'
import RNBootSplash from 'react-native-bootsplash'
import { navigationRef } from '@utilities/navigationHelper'

const AppNavigator = ({ theme }) => {
  const onReadyNavigation = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    RNBootSplash.hide({ duration: 500, fade: true })
  }

  return (
    <NavigationContainer ref={navigationRef} theme={theme} onReady={onReadyNavigation}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.colors.primary}
        barStyle={theme.dark ? 'dark-content' : 'light-content'}
      />
      <MainNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator
