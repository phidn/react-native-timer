import React from 'react'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

const SplashScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator animating={true} />
    </View>
  )
}

export default SplashScreen
