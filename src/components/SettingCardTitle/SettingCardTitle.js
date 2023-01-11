import React from 'react'
import { Text, View } from 'react-native'
import color from 'color'
import { useTheme } from 'react-native-paper'

const SettingCardTitle = ({ title }) => {
  const { colors } = useTheme()
  const _onBackground = color(colors.onBackground).alpha(0.6).toString()

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: _onBackground }}>{title}</Text>
    </View>
  )
}

export default SettingCardTitle
