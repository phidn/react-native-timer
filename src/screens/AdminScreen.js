import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'

const AdminScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button onPress={() => navigation.navigate('ScreenOne')}>Go to details</Button>
    </View>
  )
}

export default AdminScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
