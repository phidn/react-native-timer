import React, { useEffect } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import AppNavigator from '@/navigation/AppNavigator'
import { I18nextProvider } from 'react-i18next'
import i18nInstance from '@/config/i18n'
import { useStore } from '@/store/useStore'

// import AsyncStorage from '@react-native-async-storage/async-storage'
// AsyncStorage.clear()

const App = () => {
  const theme = useStore((state) => state.theme)

  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18nInstance}>
        <AppNavigator theme={theme} />
      </I18nextProvider>
    </PaperProvider>
  )
}

export default App
