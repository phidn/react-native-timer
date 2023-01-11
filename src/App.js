import React, { useEffect } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from '@/navigation/AppNavigator'
import { combineTheme } from '@/utilities/themeHelper'
import { I18nextProvider } from 'react-i18next'
import i18nInstance from '@/config/i18n'
import { useStore } from '@/store/useStore'
import Purchases from 'react-native-purchases'

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode)
  const themeColor = useStore((state) => state.themeColor)
  const theme = combineTheme(themeColor, isDarkMode)

  useEffect(() => {
    Purchases.setDebugLogsEnabled(true)
    Purchases.configure({ apiKey: 'goog_lfrHjtpKlamGDZLjBzJFYdKLQUy' })
  }, [])

  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18nInstance}>
        <AppNavigator theme={theme} />
      </I18nextProvider>
    </PaperProvider>
  )
}

export default App
