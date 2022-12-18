import React from 'react'
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native'
import { useTheme } from 'react-native-paper'

// prettier-ignore
const PageContainer = ({ paddingVertical = 40, paddingHorizontal = 30, padding, style, isScroll, children }) => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {!isScroll && (
        <View style={[styles.body, { paddingVertical, paddingHorizontal, padding }]}>{children}</View>
      )}
      {isScroll && (
        <ScrollView style={[styles.body, { paddingVertical, paddingHorizontal, padding }]}>{children}</ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
})

export default PageContainer
