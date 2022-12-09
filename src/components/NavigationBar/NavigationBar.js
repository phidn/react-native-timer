import React, { useState } from 'react'
import { Appbar, Menu } from 'react-native-paper'

const NavigationBar = ({ navigation, back, route }) => {
  const [visible, setVisible] = useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name || 'My awesome app'} />
    </Appbar.Header>
  )
}

export default NavigationBar
