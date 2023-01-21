import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Divider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logger } from '@/utilities/logger'
import { useStore } from '@/store/useStore'
import PageContainer from '@/components/Containers/PageContainer'
import { getAsset } from '@/utilities/assetsHelper'
import useSound from '@/hooks/useSound'
import { Platform, StyleSheet, View } from 'react-native'
import notifee from '@notifee/react-native'
import { getYearsDates } from '@/utilities/chartHelper'
import { getRandomIntInclusive, roundNearest } from '@/utilities/commonHelper'
import DeviceInfo from 'react-native-device-info'
import ColorPicker from '@/components/ColorPicker/ColorPicker'
import BackgroundTimer from '@/utilities/BackgroundTimer'

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
      '2023-01-01': { logs: ['10|13:38|13:48', '60|17:48|18:49'] },
    })
  }

  const randomSetSessions = () => {
    const yearDates = getYearsDates()
    const _sessions = {}
    for (let i = 0; i < yearDates.length; i++) {
      const flag = getRandomIntInclusive(0, 1)
      if (flag) {
        const count = getRandomIntInclusive(1, 3)
        const logs = []
        for (let j = 0; j < count; j++) {
          let minutes = getRandomIntInclusive(15, 35)
          minutes = roundNearest(minutes)
          logs.push(`${minutes}|00:00|00:${minutes}`)
        }
        _sessions[yearDates[i]] = { logs }
      }
    }

    setSessions(_sessions)
  }

  const { play } = useSound()
  const testBackgroundTimer = () => {
    const intervalId = BackgroundTimer.setInterval(() => console.log('tic'), 500)
  }

  useEffect(() => {
    notifee.onForegroundEvent(async ({ type, detail }) => {})
    notifee.onBackgroundEvent(async ({ type, detail }) => {})
  }, [])

  const onDisplayNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'AdminScreen',
      name: 'AdminScreen Channel',
    })

    // Display a notification
    notifee.displayNotification({
      id: 'admin_notification',
      title: 'Meditation Timer',
      body: 'Tap to go back to the app',
      subtitle: 'In progress',
      android: {
        channelId,
        largeIcon: require('../assets/images/logo.png'),
        timestamp: Date.now() + 300000,
        showChronometer: true,
        chronometerDirection: 'down',
        autoCancel: false,
      },
    })
  }

  const getDevice = async () => {
    const device = await DeviceInfo.getInstallerPackageName()
    logger('→ getDevice', device)
  }

  const isPremium = useStore((state) => state.isPremium)
  const setIsPremium = useStore((state) => state.setIsPremium)

  const togglePremium = () => {
    setIsPremium(!isPremium)
    console.log('premium status', !isPremium)
  }

  return (
    <PageContainer style={{ padding: 40 }}>
      <Card style={styles.card}>
        <Button onPress={getDevice}>Device</Button>
        <Button onPress={togglePremium}>Toggle premium</Button>
      </Card>

      <Card style={styles.card}>
        <Button onPress={clearAsyncStorage}>Clear AsyncStorage</Button>
        <Button onPress={logAsyncStorage}>Log AsyncStorage</Button>
        <Button onPress={() => logger(store)}>Log app zustand store</Button>
      </Card>

      <Card style={styles.card}>
        <Button onPress={randomSetSessions}>Random set sessions</Button>
        <Button onPress={devSession}>Dev Session</Button>
        <Button onPress={clearSession}>Clear session</Button>
        <Button onPress={() => logger(sessions)}>Log session</Button>
      </Card>

      <Card style={styles.card}>
        <Button onPress={testBackgroundTimer}>Test background timer</Button>
        <Button onPress={onDisplayNotification}>Display notifee</Button>
      </Card>
    </PageContainer>
  )
}

const AdminScreen2 = () => {
  return <View></View>
}

export default AdminScreen

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
})
