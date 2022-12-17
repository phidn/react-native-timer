import React from 'react'
import WaveContainer from '@components/Containers/WaveContainer'
import { Button, Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import logger from '@utilities/logger'
import { useStore } from '@store/useStore'
import dayjs from 'dayjs'

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

  const store = useStore()
  const logZustand = () => {
    logger(store)
  }

  const sessions = useStore((state) => state.sessions)
  const setSessions = useStore((state) => state.setSessions)
  const setSessionLogs = useStore((state) => state.setSessionLogs)
  const clearSession = useStore((state) => state.clearSession)

  const devSession = () => {
    // const date = dayjs().format('YYYY-MM-DD')
    // const started = dayjs().format('HH:mm')
    // const ended = dayjs(Date.now() + 30 * 60 *1000).format('HH:mm')
    // setSessionLogs(date, 30, started, ended)

    setSessions({
      '2022-12-08': {
        logs: ['30|13:38|14:08'],
      },
      '2022-12-09': {
        logs: ['15|13:38|14:08'],
      },
      '2022-12-10': {
        logs: ['15|13:38|14:08', '20|17:48|17:49'],
      },
      '2022-12-11': {
        logs: ['15|13:38|14:08', '60|17:48|17:49'],
      },
      '2022-12-15': {
        logs: [
          '30|13:38|14:08',
          '30|15:04|15:34',
          '60|17:33|17:34',
          '60|17:43|17:44',
          '60|17:48|17:49',
        ],
      },
    })
  }

  return (
    <WaveContainer>
      <Button onPress={clearAsyncStorage}>Clear AsyncStorage</Button>
      <Button onPress={logAsyncStorage}>Log AsyncStorage</Button>
      <Button onPress={() => logger(store)}>Log app zustand store</Button>

      <Button onPress={devSession}>Dev Session</Button>
      <Button onPress={clearSession}>Clear session</Button>
      <Button onPress={() => logger(sessions)}>Log session</Button>
    </WaveContainer>
  )
}

export default AdminScreen
