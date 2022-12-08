import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from '@navigation/AppNavigator'
import { useStore } from '@store/useStore'

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode)

  return (
    <PaperProvider>
      <StatusBar translucent={true} barStyle="default" />
      <AppNavigator />
    </PaperProvider>
  )
}

export default App
