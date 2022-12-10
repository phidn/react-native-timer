import React from 'react'
import { List, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { availableLanguages } from '@config/availableLanguages'
import WaveContainer from '@components/Containers/WaveContainer'
import { storageKeys } from '@config/storageKeys'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LanguageSettingScreen = () => {
  const { i18n } = useTranslation()
  const { outlineVariant } = useTheme().colors

  const changeLanguageHandler = async (language) => {
    AsyncStorage.setItem(storageKeys.appLanguage, language)
    i18n.changeLanguage(language)
  }

  return (
    <WaveContainer>
      {availableLanguages.map((language) => (
        <List.Item
          key={language.code}
          style={{ borderBottomWidth: 1, borderColor: outlineVariant }}
          title={language.label}
          onPress={() => changeLanguageHandler(language.code)}
          right={(props) => (
            <List.Icon
              {...props}
              icon="check"
              style={{
                opacity: i18n.resolvedLanguage === language.code ? 1 : 0,
              }}
            />
          )}
        />
      ))}
    </WaveContainer>
  )
}

export default LanguageSettingScreen