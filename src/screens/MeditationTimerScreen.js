import React, { useMemo, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import WaveContainer from '@components/Containers/WaveContainer'
import RowContainer from '@components/Containers/RowContainer'
import { getCountdown } from '@utilities/timeHelper'
import uuid from 'react-native-uuid'
import Color from 'color'
import useSound from '@hooks/useSound'
import logger from '@utilities/logger'
import { getAsset } from '@utilities/assetsHelper'

const preparationTime = 10

const MeditationTimerScreen = ({ route, navigation }) => {
  const { duration, interval, bellId, bellVolume } = route.params
  // const interval = 10
  // const duration = route.params.duration
  // const bellId = route.params.bellId
  // const bellVolume = route.params.bellVolume

  const { primary, surfaceVariant } = useTheme().colors

  const { play } = useSound()
  const { width } = useWindowDimensions()

  const [isShowCountdown, setIsShowCountdown] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [countdownKey, setCountdownKey] = useState(uuid.v4())
  const [isPrepared, setIsPrepared] = useState(true)

  const activeTime = useMemo(() => {
    return isPrepared ? preparationTime : duration
  }, [isPrepared, preparationTime, duration])

  const onUpdateCountdown = (value) => {
    if (!isPrepared && interval > 0 && value % interval === 0 && value < duration) {
      play(getAsset(bellId + '_long'), bellVolume)
    }
  }

  const onCompleteCountdown = () => {
    play(getAsset(bellId + '_short'), bellVolume, 3)
    if (isPrepared) {
      setIsPrepared(false)
      setCountdownKey(uuid.v4())
      return {}
    } else {
      navigation.goBack()
    }
  }

  const onStopCountdown = () => {
    setIsPlaying(false)
    setIsPrepared(true)
    setCountdownKey(uuid.v4())
  }

  const onBreakCountdown = () => {
    onStopCountdown()
    navigation.goBack()
  }

  return (
    <WaveContainer>
      <View style={styles.countdownContainer}>
        <CountdownCircleTimer
          key={countdownKey}
          isPlaying={isPlaying}
          duration={activeTime}
          colors={isPrepared ? [Color(primary).hex()] : [Color(surfaceVariant).hex()]}
          colorsTime={[activeTime]}
          size={width - 40}
          strokeWidth={10}
          trailColor={isPrepared ? Color(surfaceVariant).hex() : Color(primary).hex()}
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
            iconColor={primary}
            size={25}
            onPress={onBreakCountdown}
            style={[styles.iconAction, { backgroundColor: surfaceVariant }]}
          />
          <IconButton
            icon={isPlaying ? 'pause' : 'play'}
            iconColor={primary}
            size={25}
            onPress={() => setIsPlaying(!isPlaying)}
            style={[styles.iconAction, { backgroundColor: surfaceVariant }]}
          />
        </RowContainer>
      </View>
    </WaveContainer>
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
  iconAction: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
})

export default MeditationTimerScreen
