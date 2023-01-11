import React from 'react'
import { Divider, List, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import PageContainer from '@/components/Containers/PageContainer'
import { storageKeys } from '@/config/config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { availableLanguages } from '@/translations/translations'
import { View } from 'react-native'
import color from 'color'

const LanguageSettingScreen = () => {
  const { i18n } = useTranslation()
  const { colors } = useTheme()

  const changeLanguageHandler = async (language) => {
    AsyncStorage.setItem(storageKeys.appLanguage, language)
    i18n.changeLanguage(language)
  }

  return (
    <PageContainer style={{ paddingVertical: 10 }} isScroll={true}>
      {availableLanguages.map((language) => (
        <View key={language.code}>
          <List.Item
            title={language.name}
            onPress={() => changeLanguageHandler(language.code)}
            right={(props) => (
              <List.Icon
                {...props}
                icon="check"
                style={{ opacity: i18n.resolvedLanguage === language.code ? 1 : 0 }}
              />
            )}
          />
          <Divider
            horizontalInset={true}
            style={{ backgroundColor: color(colors.primary).alpha(0.2).toString() }}
          />
        </View>
      ))}
    </PageContainer>
  )
}

export default LanguageSettingScreen
