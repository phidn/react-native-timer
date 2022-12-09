import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from '@navigation/AppNavigator'
import { useStore } from '@store/useStore'
import '@config/i18n'
import { combineTheme } from '@utilities/themeHelper'

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode)
  const themeColor = useStore((state) => state.themeColor)

  const theme = combineTheme(themeColor, isDarkMode)

  return (
    <PaperProvider theme={theme}>
      <AppNavigator theme={theme} />
    </PaperProvider>
  )
}

export default App
