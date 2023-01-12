import React from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import MainNavigator from './MainNavigator'
import RNBootSplash from 'react-native-bootsplash'
import { navigationRef } from '@/utilities/navigationHelper'
import color from 'color'
import Purchases from 'react-native-purchases'
import { useStore } from '@/store/useStore'
import { logger } from '@/utilities/logger'

const AppNavigator = ({ theme }) => {
  const setIsPremium = useStore((state) => state.setIsPremium)

  const onReadyNavigation = async () => {
    Purchases.setDebugLogsEnabled(true)
    Purchases.configure({ apiKey: 'goog_lfrHjtpKlamGDZLjBzJFYdKLQUy' })

    try {
      const customerInfo = await Purchases.getCustomerInfo()
      const isPremium = customerInfo?.allPurchasedProductIdentifiers?.length > 0
      setIsPremium(isPremium)
    } catch (error) {
      logger('→ onReadyNavigation getCustomerInfo error:', error)
    }
    
    // await new Promise((resolve) => setTimeout(resolve, 1000))
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
