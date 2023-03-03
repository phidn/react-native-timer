import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './MainNavigator'
import RNBootSplash from 'react-native-bootsplash'
import { navigationRef } from '@/utilities/navigationHelper'
import color from 'color'

const AppNavigator = ({ theme }) => {
  const onReadyNavigation = async () => {
    RNBootSplash.hide({ duration: 500, fade: true })
  }

  return (
    <NavigationContainer ref={navigationRef} theme={theme} onReady={onReadyNavigation}>
      <StatusBar
        translucent={false}
        backgroundColor={
          !theme.dark
            ? color(theme.colors.card).darken(0.2).hex()
            : color(theme.colors.card).lighten(0.2).hex()
        }
        barStyle={!theme.dark ? 'dark-content' : 'light-content'}
      />
      <MainNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator
