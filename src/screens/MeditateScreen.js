import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useWindowDimensions, AppState, Linking } from 'react-native'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import PageContainer from '@/components/Containers/PageContainer'
import RowContainer from '@/components/Containers/RowContainer'
import { getCountdown, sToMin } from '@/utilities/timeHelper'
import Color from 'color'
import useSound from '@/hooks/useSound'
import { useStore } from '@/store/useStore'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { logger } from '@/utilities/logger'
import BackgroundService from 'react-native-background-actions'

let preparationTime = 10
let numberOfInviteBell = 3
let myInterval

const MeditateScreen = ({ route, navigation }) => {
  const { params } = route
  const totalTime = params.duration + preparationTime

  const { t } = useTranslation()
  const { colors } = useTheme()
  const { playLongBell, playShortBell, release } = useSound()
  const { width } = useWindowDimensions()

  const isShowCountdown = useStore((state) => state.isShowCountdown)
  const setIsShowCountdown = useStore((state) => state.setIsShowCountdown)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isPrepared, setIsPrepared] = useState(true)

  const [startedSession, setStartedSession] = useState()
  const setSessionLogs = useStore((state) => state.setSessionLogs)

  const remainingTimeRef = useRef(null)
  const appState = useRef(AppState.currentState)
  const [countdownKey, setCountdownKey] = useState(0)

  const [secondsLeft, setSecondsLeft] = useState(totalTime)
  const [listIntervalSeconds, setListIntervalSeconds] = useState([])

  const endSession = async () => {
    const date = dayjs().format('YYYY-MM-DD')
    const ended = dayjs().format('HH:mm')
    setSessionLogs(date, sToMin(params.duration), startedSession, ended)
    await playShortBell(params.bellId, params.bellVolume, numberOfInviteBell)
    navigation.goBack()
  }

  const startTimer = async () => {
    const veryIntensiveTask = async (taskDataArguments) => {
      const { delay } = taskDataArguments
      await new Promise(async (resolve) => {
        myInterval = setInterval(() => {
          setSecondsLeft((secs) => {
            if (secs > 0) return secs - 1
            else return 0
          })
        }, delay)
      })
    }

    await BackgroundService.start(veryIntensiveTask, {
      taskName: 'mindfulness_timer',
      taskTitle: t('common.appName'),
      taskDesc: t('notify.returnToApp'),
      taskIcon: {
        name: 'ic_small_icon',
        type: 'drawable',
      },
      color: colors.primary,
      linkingURI: 'mindfulcheckin://',
      parameters: {
        delay: 1000,
      },
    })
  }

  useEffect(() => {
    Linking.addEventListener('url', () => {})
    startTimer()

    const _startedSession = dayjs().format('HH:mm')
    setStartedSession(_startedSession)

    const listSeconds = []
    const initSeconds = params.duration - params.interval
    for (let i = initSeconds; i > 0; i = i - params.interval) {
      listSeconds.push(i)
    }
    setListIntervalSeconds(listSeconds)

    return async () => {
      release()
      await BackgroundService.stop()
      clearInterval(myInterval)
    }
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      }
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!isPrepared) {
          remainingTimeRef.current = secondsLeft
          setCountdownKey((x) => x + 1)
        }
      }
      appState.current = nextAppState
    })

    if (secondsLeft === params.duration) {
      playShortBell(params.bellId, params.bellVolume, numberOfInviteBell)
      setIsPrepared(false)
      remainingTimeRef.current = secondsLeft
      setCountdownKey((x) => x + 1)
    }

    if (secondsLeft === 0) {
      endSession()
    }

    return () => {
      subscription.remove()
    }
  }, [secondsLeft, startedSession])

  useEffect(() => {
    if (listIntervalSeconds?.indexOf(secondsLeft) !== -1) {
      playLongBell(params.bellId, params.bellVolume)
    }
  }, [secondsLeft, listIntervalSeconds])

  const onPauseCountdown = async () => {
    if (isPlaying) {
      release()
      await BackgroundService.stop()
      clearInterval(myInterval)
    }

    if (!isPlaying) {
      startTimer()
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <PageContainer>
      <View style={styles.countdownContainer}>
        <CountdownCircleTimer
          key={countdownKey}
          initialRemainingTime={remainingTimeRef.current}
          isPlaying={isPlaying}
          duration={isPrepared ? preparationTime : params.duration}
          colors={isPrepared ? [Color(colors.primary).hex()] : [Color(colors.surfaceVariant).hex()]}
          colorsTime={[isPrepared ? preparationTime : params.duration]}
          size={width - 40}
          strokeWidth={15}
          trailColor={isPrepared ? Color(colors.surfaceVariant).hex() : Color(colors.primary).hex()}
          strokeLinecap="butt"
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
                  {isShowCountdown && isPrepared && (
                    <Text variant="displayMedium">{remainingTime}</Text>
                  )}
                  {isShowCountdown && !isPrepared && (
                    <Text variant="displayMedium" style={{ textAlign: 'center' }}>
                      {getCountdown(remainingTime)}
                    </Text>
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
