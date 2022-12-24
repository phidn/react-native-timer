import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'

// prettier-ignore
const PageContainer = ({ containerStyle, style, isScroll, children }) => {
  const { colors } = useTheme()

  const _containerStyle = [{ flex: 1 }, containerStyle]

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {!isScroll && <View style={_containerStyle}>{children}</View>}
      {isScroll && <ScrollView style={_containerStyle}>{children}</ScrollView>}
    </View>
  )
}

export default PageContainer
