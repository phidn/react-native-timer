import React, { useEffect, useState } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from '@navigation/AppNavigator'
import { useStore } from '@store/useStore'
import { combineTheme } from '@utilities/themeHelper'
import { I18nextProvider } from 'react-i18next'
import i18nInstance from '@config/i18n'
import logger from '@utilities/logger'

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode)
  const themeColor = useStore((state) => state.themeColor)
  const theme = combineTheme(themeColor, isDarkMode)
  
  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18nInstance}>
        <AppNavigator theme={theme} />
      </I18nextProvider>
    </PaperProvider>
  )
}

export default App
