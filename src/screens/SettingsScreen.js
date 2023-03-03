import { Linking, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Card, List, Switch } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import RowContainer from '@/components/Containers/RowContainer'
import ListColor from '@/components/Color/ListColor'
import { useStore } from '@/store/useStore'
import PageContainer from '@/components/Containers/PageContainer'
import { availableLanguages, getLanguageName } from '@/translations/translations'
import SettingCardTitle from '@/components/SettingCardTitle/SettingCardTitle'
import DeviceInfo from 'react-native-device-info'
import { privacyPolicyLink, screens, termsAndConditionsLink } from '@/config/config'
import RateHelper, { AndroidMarket } from '@/utilities/rateHelper'
import ColorPickerModal from '@/components/Modals/ColorPickerModal'

const PAGE_PADDING_HORIZONTAL = 10

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()

  const isDarkMode = useStore((state) => state.isDarkMode)
  const toggleMode = useStore((state) => state.toggleMode)
  const language = availableLanguages.find((x) => x.code === i18n.resolvedLanguage)

  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)

  const feedbackHandler = async () => {
    const subject = `[${DeviceInfo.getApplicationName()}] ${t('Settings.moreSetting.feedback')}`

    // - Package: ${await DeviceInfo.getInstallerPackageName()}
    const message = `
      - Version: ${DeviceInfo.getVersion()}
      - OS API: ${await DeviceInfo.getApiLevel()}
      - Language: ${getLanguageName(i18n.resolvedLanguage)}
      - Device: ${await DeviceInfo.getDevice()} | ${await DeviceInfo.getDeviceName()}
    `

    const _break = '%0D%0A'
    const _message = message.replace(/      - /g, '').trim() + _break + _break + _break

    Linking.openURL(`mailto:hello.dangnhatphi@gmail.com?subject=${subject}&body=${_message}`).catch(
      (err) => console.error('ERROR > cannot open send email', err)
    )
  }

  const rateApp = () => {
    const options = {
      GooglePackageName: 'com.phidang.mindfulcheckin',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
    }
    RateHelper.rate(options, (success, errorMessage) => {})
  }

  const togglePicker = () => {
    setIsShowSoundDialog(!isShowSoundDialog)
  }

  return (
    <PageContainer
      isScroll={true}
      style={{ paddingHorizontal: PAGE_PADDING_HORIZONTAL, marginTop: 20 }}
    >
      <SettingCardTitle title={t('Settings.appearance')} />
      <Card style={[styles.card, { paddingBottom: 20 }]}>
        <List.Item
          title={t('Settings.language')}
          description={language?.name ? language.name : ''}
          left={(props) => <Entypo {...props} name="language" size={24} />}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => navigation.navigate(screens.LanguageSettingScreen)}
        />
        <List.Item
          title={t('Settings.colorMode')}
          description={isDarkMode ? t('Settings.colorMode.dark') : t('Settings.colorMode.light')}
          left={(props) => (
            <MaterialIcons
              {...props}
              name={isDarkMode ? 'lightbulb' : 'lightbulb-outline'}
              size={24}
            />
          )}
          right={() => <Switch value={isDarkMode} onValueChange={toggleMode} />}
        />
        <List.Item
          title={t('Settings.themeColors')}
          left={(props) => <Ionicons {...props} name="color-palette-outline" size={24} />}
        />
        <RowContainer style={{ justifyContent: 'flex-start', marginLeft: 50 }}>
          <ListColor
            togglePicker={togglePicker}
            gap={85 + PAGE_PADDING_HORIZONTAL * 2}
            range={[0, 9]}
          />
        </RowContainer>
      </Card>

      <SettingCardTitle title={t('Settings.support')} />
      <Card style={styles.card}>
        <List.Item
          title={t('Settings.moreSetting.feedback')}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="email-edit-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={feedbackHandler}
        />
        <List.Item
          title={t('Settings.moreSetting.rateApp')}
          left={(props) => <MaterialIcons {...props} name="star-outline" size={24} />}
          onPress={rateApp}
        />
      </Card>

      <SettingCardTitle title={t('Settings.moreSetting')} />
      <Card style={styles.card}>
        <List.Item
          title={t('Settings.moreSetting.privacyPolicy')}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="file-document-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => Linking.openURL(privacyPolicyLink)}
        />
        <List.Item
          title={t('Settings.moreSetting.terms')}
          left={(props) => (
            <MaterialCommunityIcons {...props} name="file-document-outline" size={24} />
          )}
          right={() => <List.Icon icon="chevron-right" />}
          onPress={() => Linking.openURL(termsAndConditionsLink)}
        />
      </Card>

      <ColorPickerModal
        navigation={navigation}
        isShowSoundDialog={isShowSoundDialog}
        setIsShowSoundDialog={setIsShowSoundDialog}
      />
    </PageContainer>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 20,
  },
})
