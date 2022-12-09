import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar, List, Switch, Text, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import RowContainer from '@components/Containers/RowContainer'
import ListColor from '@components/Color/ListColor'
import { useStore } from '@store/useStore'

const SettingsScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const { isDarkTheme, toggleMode } = useStore()

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Item
          title={t('Settings.SettingsScreen.item.color-mode.label')}
          description={
            isDarkTheme
              ? t('Settings.SettingsScreen.item.color-mode.dark')
              : t('Settings.SettingsScreen.item.color-mode.light')
          }
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={isDarkTheme} onValueChange={toggleMode} />}
        />
        <List.Item
          title={t('Settings.SettingsScreen.item.theme-colors.label')}
          left={(props) => <Ionicons {...props} name="color-palette-outline" size={24} />}
        />
        <RowContainer style={{ justifyContent: 'flex-start', marginLeft: 50 }}>
          <ListColor gap={85} />
        </RowContainer>
      </List.Section>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {},
})
