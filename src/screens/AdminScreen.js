import React, { useRef } from 'react'
import { Button, Card, Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logger } from '@/utilities/logger'
import { useStore } from '@/store/useStore'
import dayjs from 'dayjs'
import PageContainer from '@/components/Containers/PageContainer'
import { getAsset } from '@/utilities/assetsHelper'
import useSound from '@/hooks/useSound'
import _BackgroundTimer from 'react-native-background-timer'
import { StyleSheet } from 'react-native'

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
    setSessions({
      '2022-10-02': { logs: ['15|13:38|14:08', '60|17:00|18:00'] },
      '2022-10-13': { logs: ['15|13:38|14:08', '30|17:30|18:00'] },
      '2022-10-15': { logs: ['15|13:38|14:08', '30|17:30|18:00'] },

      '2022-11-11': { logs: ['15|13:38|14:08', '60|17:48|18:49'] },
      '2022-12-08': { logs: ['30|13:38|14:08'] },

      '2021-09-11': { logs: ['15|13:38|14:08', '60|17:48|18:49'] },
      '2022-09-10': { logs: ['15|13:38|14:08', '60|17:48|18:49'] },

      '2022-12-09': { logs: ['15|13:38|14:08'] },
      '2022-12-10': { logs: ['15|13:38|14:08', '20|17:48|17:49'] },
      '2022-12-11': { logs: ['15|13:38|14:08', '60|17:48|18:49'] },
      '2022-12-15': { logs: ['30|13:38|14:08', '60|17:33|18:34', '60|17:48|18:49'] },
      '2022-12-21': { logs: ['10|13:38|13:48', '60|17:48|18:49'] },
      '2022-12-22': { logs: ['10|13:38|13:48', '60|17:48|18:49'] },
    })
  }

  const { play } = useSound()
  const testBackgroundTimer = () => {
    console.log('testBackgroundTimer run')
    _BackgroundTimer.runBackgroundTimer(() => {
      play(getAsset('bell_10_long'), 1)
    }, 1000 * 10)
  }

  return (
    <PageContainer style={{ padding: 40 }}>
      <Card style={styles.card}>
        <Button onPress={clearAsyncStorage}>Clear AsyncStorage</Button>
        <Button onPress={logAsyncStorage}>Log AsyncStorage</Button>
        <Button onPress={() => logger(store)}>Log app zustand store</Button>
      </Card>

      <Card style={styles.card}>
        <Button onPress={devSession}>Dev Session</Button>
        <Button onPress={clearSession}>Clear session</Button>
        <Button onPress={() => logger(sessions)}>Log session</Button>
      </Card>

      <Card style={styles.card}>
        <Button onPress={testBackgroundTimer}>Test background timer</Button>
      </Card>
    </PageContainer>
  )
}

export default AdminScreen

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
})
