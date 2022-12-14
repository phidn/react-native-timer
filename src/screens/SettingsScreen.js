import { StyleSheet, View } from 'react-native'
import React from 'react'
import { List, Switch } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RowContainer from '@components/Containers/RowContainer'
import ListColor from '@components/Color/ListColor'
import { useStore } from '@store/useStore'
import WaveContainer from '@components/Containers/WaveContainer'
import { availableLanguages } from '@config/availableLanguages'
import logger from '@utilities/logger'

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const isDarkMode = useStore((state) => state.isDarkMode)
  const toggleMode = useStore((state) => state.toggleMode)

  const language = availableLanguages.find((x) => x.code === i18n.resolvedLanguage)

  return (
    <WaveContainer>
      <View style={styles.container}>
        <List.Section>
          <List.Item
            title={t('Settings.language')}
            description={language?.label ? language.label : ''}
            left={(props) => <MaterialIcons {...props} name="language" size={24} />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() => navigation.navigate('LanguageSettingScreen')}
          />
          <List.Item
            title={t('Settings.color-mode')}
            description={
              isDarkMode ? t('Settings.color-mode.dark') : t('Settings.color-mode.light')
            }
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={isDarkMode} onValueChange={toggleMode} />}
          />
          <List.Item
            title={t('Settings.theme-colors')}
            left={(props) => <Ionicons {...props} name="color-palette-outline" size={24} />}
          />
          <RowContainer style={{ justifyContent: 'flex-start', marginLeft: 50 }}>
            <ListColor gap={85} />
          </RowContainer>
        </List.Section>
      </View>
    </WaveContainer>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
