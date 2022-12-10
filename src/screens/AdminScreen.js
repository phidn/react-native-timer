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
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          logger('AsyncStorage item', { [store[i][0]]: store[i][1] })
          return true
        })
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
