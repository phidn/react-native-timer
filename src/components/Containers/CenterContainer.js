import React from 'react'
import { View } from 'react-native'

const CenterContainer = ({ style, children }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', ...style }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  )
}

export default CenterContainer
