import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import PageContainer from '@/components/Containers/PageContainer'
import RowContainer from '@/components/Containers/RowContainer'
import { getCountdown, sToMin, sToMs } from '@/utilities/timeHelper'
import Color from 'color'
import useSound from '@/hooks/useSound'
import { useStore } from '@/store/useStore'
import dayjs from 'dayjs'
import _BackgroundTimer from '@/utilities/BackgroundTimer'
import { useTranslation } from 'react-i18next'
import notifee from '@notifee/react-native'

let preparationTime = 10
let numberOfInviteBell = 3

const channelMT = {
  id: 'meditation_timer_channel',
  name: 'Meditation Timer Channel',
}

const baseNotifeeMTAndroid = {
  smallIcon: 'ic_small_icon',
  largeIcon: require('../assets/images/logo.png'),
  channelId: channelMT.id,
  autoCancel: false,
  pressAction: {
    id: 'default',
    launchActivity: 'default',
  },
}

const MeditateScreen = ({ route, navigation }) => {
  const { params } = route
  if (__DEV__) {
    params.duration = 40
    params.interval = 10
    preparationTime = 5
    numberOfInviteBell = 2
  }

  const msDuration = sToMs(params.duration)
  const msInterval = sToMs(params.interval)
  const isInterval = params.interval > 0

  const { t } = useTranslation()
  const { colors } = useTheme()
  const { playLongBell, playShortBell, release } = useSound()
  const { width } = useWindowDimensions()

  const baseNotifeeMT = {
    id: 'meditation_timer',
    title: 'Meditation Timer',
    body: t('notifee.return-to-app'),
  }

  const isShowCountdown = useStore((state) => state.isShowCountdown)
  const setIsShowCountdown = useStore((state) => state.setIsShowCountdown)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isPrepared, setIsPrepared] = useState(true)

  const [startedSession, setStartedSession] = useState()
  const setSessionLogs = useStore((state) => state.setSessionLogs)

  const remainingTimeRef = useRef(preparationTime)

  const intervalTask = async () => {
    _BackgroundTimer.setInterval(() => {
      const remainingTime = remainingTimeRef.current
      if (remainingTime >= params.interval) {
        playLongBell(params.bellId, params.bellVolume)
      }
    }, msInterval)
  }

  const endSession = async (started) => {
    const date = dayjs().format('YYYY-MM-DD')
    const ended = dayjs().format('HH:mm')
    setSessionLogs(date, sToMin(params.duration), started, ended)
    await playShortBell(params.bellId, params.bellVolume, numberOfInviteBell)
    navigation.goBack()
  }

  useEffect(() => {
    notifee.onForegroundEvent(({ type, detail }) => {})
    notifee.onBackgroundEvent(async ({ type, detail }) => {})
  }, [])

  useEffect(() => {
    const prepareTask = async () => {
      /**
       * notifee
       */
      await notifee.requestPermission()
      await notifee.createChannel(channelMT)

      notifee.displayNotification({
        ...baseNotifeeMT,
        subtitle: t('notifee.inviting-bell'),
        android: {
          ...baseNotifeeMTAndroid,
          showChronometer: true,
          chronometerDirection: 'down',
          timestamp: Date.now() + preparationTime * 1000,
        },
      })

      /**
       * Background Timer
       */
      const _startedSession = dayjs().format('HH:mm')
      const sessionDelay = (params.duration + preparationTime) * 1000
      const prepareDelay = preparationTime * 1000

      const startSession = () => {
        playShortBell(params.bellId, params.bellVolume, numberOfInviteBell)
        setIsPrepared(false)
        // remainingTimeRef.current = params.duration
        // setCountdownKey(uuid.v4())
        setStartedSession(_startedSession)

        notifee.displayNotification({
          ...baseNotifeeMT,
          subtitle: t('notifee.in-progress'),
          android: {
            ...baseNotifeeMTAndroid,
            showChronometer: true,
            chronometerDirection: 'down',
            timestamp: Date.now() + msDuration + 1000,
          },
        })

        if (isInterval) {
          intervalTask()
        }
      }

      _BackgroundTimer.setTimeout(() => startSession(), prepareDelay)
      _BackgroundTimer.setTimeout(() => endSession(_startedSession), sessionDelay)
    }
    prepareTask()

    return () => {
      release()
      _BackgroundTimer.clearAll()
      notifee.cancelNotification(baseNotifeeMT.id)
    }
  }, [])

  const startAfterPauseTask = (delayTime) => {
    const remainingTime = remainingTimeRef.current

    const playSession = () => {
      if (remainingTime >= params.interval) {
        playLongBell(params.bellId, params.bellVolume)
      }
      if (isInterval) {
        intervalTask()
      }
    }

    _BackgroundTimer.setTimeout(() => playSession(), delayTime * 1000)
    _BackgroundTimer.setTimeout(() => endSession(startedSession), remainingTime * 1000)
  }

  const onPauseCountdown = () => {
    // Pause countdown:
    if (isPlaying) {
      release()
      _BackgroundTimer.clearAll()

      notifee.displayNotification({
        ...baseNotifeeMT,
        subtitle: t('notifee.in-progress'),
        android: {
          ...baseNotifeeMTAndroid,
        },
      })
    }

    // Start countdown => start background interval
    if (!isPlaying) {
      const remainingTime = remainingTimeRef.current

      for (let nextTime = remainingTime; nextTime > 0; nextTime--) {
        if (nextTime % params.interval === 0) {
          startAfterPauseTask(remainingTime - nextTime)
          break
        }
      }

      notifee.displayNotification({
        ...baseNotifeeMT,
        subtitle: t('notifee.in-progress'),
        android: {
          ...baseNotifeeMTAndroid,
          showChronometer: true,
          chronometerDirection: 'down',
          timestamp: Date.now() + remainingTime * 1000,
        },
      })
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <PageContainer>
      <View style={styles.countdownContainer}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={params.duration + preparationTime}
          colors={[
            Color(colors.secondary).hex(),
            Color(colors.primary).hex(),
            Color(colors.primary).hex(),
          ]}
          colorsTime={[params.duration + preparationTime, params.duration, 0]}
          size={width - 40}
          strokeWidth={10}
          trailColor={Color(colors.surfaceVariant).hex()}
          strokeLinecap="round"
        >
          {({ remainingTime }) => {
            remainingTimeRef.current = remainingTime

            return (
              <TouchableRipple
                onPress={() => setIsShowCountdown(!isShowCountdown)}
                rippleColor="rgba(0, 0, 0, .32)"
                borderless={true}
                style={[
                  styles.timeTouchable,
                  { width: width - 40, height: width - 40, borderRadius: (width - 40) / 2 },
                ]}
                centered={true}
              >
                <View style={styles.timerTouchableContent}>
                  {isShowCountdown && !isPrepared && (
                    <Text variant="displayMedium" style={{ textAlign: 'center' }}>
                      {getCountdown(remainingTime)}
                    </Text>
                  )}
                  {isShowCountdown && isPrepared && (
                    <Text variant="displayMedium">{remainingTime - params.duration}</Text>
                  )}
                </View>
              </TouchableRipple>
            )
          }}
        </CountdownCircleTimer>
        {isPrepared && (
          <RowContainer style={{ marginTop: 40 }}>
            <IconButton
              icon="close"
              iconColor={colors.onSurfaceVariant}
              size={25}
              onPress={() => navigation.goBack()}
              style={[styles.iconAction, { backgroundColor: colors.surfaceVariant }]}
            />
          </RowContainer>
        )}
        {!isPrepared && (
          <RowContainer style={{ marginTop: 40 }}>
            <IconButton
              icon="close"
              iconColor={colors.onSurfaceVariant}
              size={25}
              onPress={() => navigation.goBack()}
              style={[
                styles.iconAction,
                { backgroundColor: colors.surfaceVariant, opacity: isPlaying ? 0 : 1 },
              ]}
            />
            <IconButton
              icon={isPlaying ? 'pause' : 'play'}
              iconColor={colors.primary}
              size={25}
              onPress={onPauseCountdown}
              style={[styles.iconAction, { backgroundColor: colors.surfaceVariant }]}
            />
            <IconButton
              icon={'stop'}
              iconColor={colors.primary}
              size={25}
              style={[styles.iconAction, { opacity: 0 }]}
            />
          </RowContainer>
        )}
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  countdownContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  timerTouchableContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    flex: 1,
    marginTop: 40,
    flexDirection: 'row',
  },
  iconAction: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
})

export default MeditateScreen
