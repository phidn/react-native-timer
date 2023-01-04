import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'

const TopBannerAdContainer = ({ style, children }) => {
  const childrenAdMob = children[0]
  const childrenContent = children.slice(1)
  
  const { colors } = useTheme()

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      <View>{childrenAdMob}</View>
      <View style={[{ flex: 1 }, style]}>{childrenContent}</View>
    </ScrollView>
  )
}

export default TopBannerAdContainer
