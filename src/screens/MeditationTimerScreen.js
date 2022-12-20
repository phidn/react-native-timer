import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import PageContainer from '@components/Containers/PageContainer'
import RowContainer from '@components/Containers/RowContainer'
import { getCountdown } from '@utilities/timeHelper'
import uuid from 'react-native-uuid'
import Color from 'color'
import useSound from '@hooks/useSound'
import logger from '@utilities/logger'
import { getAsset } from '@utilities/assetsHelper'
import { useStore } from '@store/useStore'
import dayjs from 'dayjs'
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player'
import { setupTrackPlayerService } from '@services/trackPlayerService'

const preparationTime = 5

const MeditationTimerScreen = ({ route, navigation }) => {
  const { duration, interval, bellId, bellVolume } = route.params

  const { colors } = useTheme()
  const { play } = useSound()
  const { width } = useWindowDimensions()

  const isShowCountdown = useStore((state) => state.isShowCountdown)
  const setIsShowCountdown = useStore((state) => state.setIsShowCountdown)

  const [isPlaying, setIsPlaying] = useState(false)
  const [countdownKey, setCountdownKey] = useState(uuid.v4())
  const [isPrepared, setIsPrepared] = useState(true)
  const activeTime = isPrepared ? preparationTime : duration

  const [startedSession, setStartedSession] = useState()
  const setSessionLogs = useStore((state) => state.setSessionLogs)

  const playBackState = usePlaybackState()
  const progress = useProgress()
  const [isPlayerReady, setIsPlayerReady] = useState(false)

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        const _isPlayerReady = await setupTrackPlayerService()
        setIsPlayerReady(_isPlayerReady)
        if (_isPlayerReady) {
          await TrackPlayer.add([
            {
              title: 'Mindfulness Meditation',
              artist: 'Timer',
              artwork: 'https://is4-ssl.mzstatic.com/image/thumb/Music1/v4/9e/90/c0/9e90c0fd-5cd8-9bee-7983-07c6ac1586f6/source/170x170bb.jpg',
            },
          ])
          setIsPlaying(true)
        } else {
          throw new Error('setupTrackPlayerService error')
        }
      } catch (error) {
        logger('setupPlayer', error, 'error')
      }
    }
    setupPlayer()

    return () => {
      TrackPlayer.reset()
    }
  }, [])

  // prettier-ignore
  const onUpdateCountdown = async (value) => {
    if (
      !isPrepared &&
      interval > 0 &&
      value > 0 &&
      value % interval === 0 &&
      value < duration
    ) {
      await play(getAsset(bellId + '_long'), bellVolume)
    }
  }

  const onCompleteCountdown = async () => {
    await play(getAsset(bellId + '_short'), bellVolume, 3)
    if (isPrepared) {
      setIsPrepared(false)
      setCountdownKey(uuid.v4())
      setStartedSession(dayjs().format('HH:mm'))
      await TrackPlayer.play()
      return {}
    } else {
      const dateSession = dayjs().format('YYYY-MM-DD')
      const endedSession = dayjs().format('HH:mm')
      setSessionLogs(dateSession, duration / 60, startedSession, endedSession)
      navigation.goBack()
    }
  }

  const onStopCountdown = () => {
    setIsPlaying(false)
    setIsPrepared(true)
    setCountdownKey(uuid.v4())
  }

  const onBreakCountdown = () => {
    if (isPlaying) return

    onStopCountdown()
    navigation.goBack()
  }

  const onPauseCountdown = async () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      console.log('→ TrackPlayer.play')
      await TrackPlayer.play()
    } else {
      console.log('→ TrackPlayer.pause')
      await TrackPlayer.pause()
    }
  }

  return (
    <PageContainer>
      <View style={styles.countdownContainer}>
        <CountdownCircleTimer
          key={countdownKey}
          isPlaying={isPlaying}
          duration={activeTime}
          colors={isPrepared ? [Color(colors.primary).hex()] : [Color(colors.surfaceVariant).hex()]}
          colorsTime={[activeTime]}
          size={width - 40}
          strokeWidth={10}
          trailColor={isPrepared ? Color(colors.surfaceVariant).hex() : Color(colors.primary).hex()}
          strokeLinecap="round"
          onUpdate={onUpdateCountdown}
          onComplete={onCompleteCountdown}
        >
          {({ remainingTime }) => (
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
          )}
        </CountdownCircleTimer>
        <RowContainer style={{ marginTop: 40 }}>
          <IconButton
            icon={'stop'}
            iconColor={colors.primary}
            size={25}
            style={[styles.iconAction, { opacity: 0 }]}
          />
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            iconColor={colors.primary}
            size={25}
            onPress={onPauseCountdown}
            style={[styles.iconAction, { backgroundColor: colors.surfaceVariant }]}
          />
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
        </RowContainer>
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
