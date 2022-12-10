import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Appbar } from 'react-native-paper'

const NavigationBar = ({ navigation, back, route }) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: 'transparent' }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content
        title={route.name || t('App.Name')}
        mode="center-aligned"
        style={{ backgroundColor: 'transparent' }}
      />
    </Appbar.Header>
  )
}

export default NavigationBar
