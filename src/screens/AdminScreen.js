import React from 'react'
import WaveContainer from '@components/Containers/WaveContainer'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logger from '@utilities/logger'

const AdminScreen = () => {
  const clearAsyncStorage = () => {
    AsyncStorage.clear()
  }
  const logAsyncStorage = () => {
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        let result = {}
        for (let keyVal of keyValArray) {
          result[keyVal[0]] = keyVal[1]
        }

        logger('AsyncStorage', result)
      })
    })
  }

  return (
    <WaveContainer>
      <Button onPress={clearAsyncStorage}>Clear AsyncStorage</Button>
      <Button onPress={logAsyncStorage}>Log AsyncStorage</Button>
    </WaveContainer>
  )
}

export default AdminScreen
