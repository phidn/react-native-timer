import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, useWindowDimensions, AppState } from 'react-native'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import PageContainer from '@/components/Containers/PageContainer'
import RowContainer from '@/components/Containers/RowContainer'
import { getCountdown, getDuration, getCountdownV2, sToMin, sToMs } from '@/utilities/timeHelper'
import uuid from 'react-native-uuid'
import Color from 'color'
import useSound from '@/hooks/useSound'
import { logger } from '@/utilities/logger'
import { getAsset } from '@/utilities/assetsHelper'
import { useStore } from '@/store/useStore'
import dayjs from 'dayjs'
import _BackgroundTimer from '@/utilities/BackgroundTimer'
import { useTranslation } from 'react-i18next'

const preparationTime = 10

const MeditationTimerScreen = ({ route, navigation }) => {
  const { params } = route
  if (__DEV__) {
    // params.duration = 30
    // params.interval = 10
  }
  const msDuration = sToMs(params.duration)
  const msInterval = sToMs(params.interval)
  const isInterval = params.interval > 0

  const { t } = useTranslation()
  const { colors } = useTheme()
  const { play } = useSound()
  const { width } = useWindowDimensions()

  const isShowCountdown = useStore((state) => state.isShowCountdown)
  const setIsShowCountdown = useStore((state) => state.setIsShowCountdown)

  const [isPlaying, setIsPlaying] = useState(true)
  const [countdownKey, setCountdownKey] = useState(uuid.v4())
  const [isPrepared, setIsPrepared] = useState(true)
  const activeTime = isPrepared ? preparationTime : params.duration

  const [startedSession, setStartedSession] = useState()
  const setSessionLogs = useStore((state) => state.setSessionLogs)

  const remainingTimeRef = useRef(preparationTime)
  
  const appState = useRef(AppState.currentState)
  const [appComeBackgroundTime, setAppComeBackgroundTime] = useState()
  const [appComeBgRemainingTime, setAppComeBgRemainingTime] = useState()

  const playLongBell = () => play(getAsset(params.bellId + '_long'), params.bellVolume)
  const playShortBell = () => play(getAsset(params.bellId + '_short'), params.bellVolume, 3)

  const intervalTask = async () => {
    _BackgroundTimer.setInterval(() => {
      const remainingTime = remainingTimeRef.current
      if (remainingTime >= params.interval) {
        playLongBell()
      }
    }, msInterval)
  }

  const endSession = async (started) => {
    const date = dayjs().format('YYYY-MM-DD')
    const ended = dayjs().format('HH:mm')
    setSessionLogs(date, sToMin(params.duration), started, ended)
    await playShortBell()
    navigation.goBack()
  }

  useEffect(() => {
    const prepareTask = () => {
      const _startedSession = dayjs().format('HH:mm')
      const sessionDelay = (params.duration + preparationTime) * 1000
      const prepareDelay = preparationTime * 1000

      const startSession = () => {
        playShortBell()
        setIsPrepared(false)
        remainingTimeRef.current = params.duration
        setCountdownKey(uuid.v4())
        setStartedSession(_startedSession)

        if (isInterval) {
          intervalTask()
        }
      }

      _BackgroundTimer.setTimeout(() => startSession(), prepareDelay)
      _BackgroundTimer.setTimeout(() => endSession(_startedSession), sessionDelay)
    }

    prepareTask()

    return () => {
      _BackgroundTimer.clearAll()
    }
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        if (isPrepared) {
          setAppComeBackgroundTime(Date.now())
          setAppComeBgRemainingTime(remainingTimeRef.current * 1000)
        }
      }
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (!isPrepared && appComeBackgroundTime) {
          const appComeToActiveTime = Date.now()
          const inactiveDuration = appComeToActiveTime - appComeBackgroundTime
          params.duration(msDuration - inactiveDuration + appComeBgRemainingTime) / 1000
          setCountdownKey(uuid.v4())
        }
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [isPrepared, appComeBackgroundTime, appComeBgRemainingTime])

  const onBreakCountdown = () => {
    if (!isPlaying) {
      navigation.goBack()
    }
  }

  const startAfterPauseTask = (delayTime) => {
    const remainingTime = remainingTimeRef.current - 1

    const playSession = () => {
      if (remainingTime >= params.interval) {
        playLongBell()
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
      _BackgroundTimer.clearAll()
    }

    // Start countdown => start background interval
    if (!isPlaying) {
      const remainingTime = remainingTimeRef.current

      for (let nextTime = remainingTime; nextTime > 0; nextTime--) {
        if (nextTime % params.interval === 0) {
          const delay = remainingTime - nextTime
          startAfterPauseTask(delay - 1)
          break
        }
      }
    }

    setIsPlaying(!isPlaying)
  }

  return (
    <PageContainer>
      <View style={styles.countdownContainer}>
        <CountdownCircleTimer
          initialRemainingTime={remainingTimeRef.current}
          key={countdownKey}
          isPlaying={isPlaying}
          duration={activeTime}
          colors={isPrepared ? [Color(colors.primary).hex()] : [Color(colors.surfaceVariant).hex()]}
          colorsTime={[activeTime]}
          size={width - 40}
          strokeWidth={10}
          trailColor={isPrepared ? Color(colors.surfaceVariant).hex() : Color(colors.primary).hex()}
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
                    <Text variant="displayMedium">{remainingTime}</Text>
                  )}
                </View>
              </TouchableRipple>
            )
          }}
        </CountdownCircleTimer>
        {!isPrepared && (
          <RowContainer style={{ marginTop: 40 }}>
            <IconButton
              icon="close"
              iconColor={colors.onSurfaceVariant}
              size={25}
              onPress={onBreakCountdown}
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

export default MeditationTimerScreen
