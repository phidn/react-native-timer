import { StyleSheet, View } from 'react-native'
import React from 'react'

const RowContainer = ({ style, reverse, children, ...rest }) => {
  const direction = reverse ? 'row-reverse' : 'row'

  return (
    <View style={[styles.container, style, { flexDirection: direction }]} {...rest}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default RowContainer
