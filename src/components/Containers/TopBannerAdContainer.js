import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'

const TopBannerAdContainer = ({ style, children }) => {
  const { colors } = useTheme()

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </ScrollView>
  )
}

export default TopBannerAdContainer
