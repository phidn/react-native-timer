import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import WaveContainer from '@components/Containers/WaveContainer'
import {
  Text,
  List,
  useTheme,
  Switch,
  RadioButton,
  Button,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { getDuration, getInterval } from '@utilities/timeHelper'
import Feather from 'react-native-vector-icons/Feather'
import RowContainer from '@components/Containers/RowContainer'
import Slider from '@react-native-community/slider'
import useSound from '@hooks/useSound'
import { getAsset } from '@utilities/assetsHelper'

const min_30 = 60 * 30 * 1000
const min_5 = 60 * 5 * 1000
const initTime = 1640970000000
const initDuration = initTime + min_30
const initInterval = initTime + min_5

const PresetScreen = ({ navigation }) => {
  const { elevation, primary, onBackground, outlineVariant } = useTheme().colors
  const { play, release } = useSound()

  const [duration, setDuration] = useState(min_30 / 1000)
  const [interval, setInterval] = useState(min_5 / 1000)
  const [isShowCountdown, setIsShowCountdown] = useState(true)
  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)
  const [bellId, setBellId] = useState('bell_10')
  const [bellVolume, setBellVolume] = useState(0.5)

  const showTimePicker = (type) => {
    const onChange = (event, value) => {
      if (type === 'duration') {
        setDuration((value.getTime() - initTime) / 1000)
      } else {
        setInterval((value.getTime() - initTime) / 1000)
      }
    }

    const value = new Date(type === 'duration' ? initDuration : initInterval)
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: 'time',
      display: 'spinner',
      is24Hour: true,
      minuteInterval: 5,
      positiveButton: { textColor: primary },
      neutralButton: { textColor: primary },
      negativeButton: { textColor: primary },
    })
  }

  const toggleDisplayCountdown = () => {
    setIsShowCountdown(!isShowCountdown)
  }

  const onBellChange = async (value) => {
    setBellId(value)
    play(getAsset(value + '_short'), bellVolume)
  }

  const onBellVolumeChangeComplete = async (value) => {
    setBellVolume(value)
    play(getAsset(bellId + '_short'), value)
  }

  const startSession = async () => {
    release()
    navigation.navigate('MeditationScreen', {
      duration,
      interval,
      bellId,
      bellVolume,
    })
  }

  return (
    <WaveContainer padding={30}>
      <View style={styles.container}>
        <List.Item
          title={<Text variant="titleMedium">Show Countdown</Text>}
          right={() => (
            <Switch
              style={{ marginRight: isShowCountdown ? 5 : 0 }}
              value={isShowCountdown}
              onValueChange={toggleDisplayCountdown}
            />
          )}
          style={{ display: 'none' }}
        />
        <List.Item
          title={<Text variant="titleMedium">Duration</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {getDuration(duration, 'H[h] m[m]')}
              </Text>
              <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
            </RowContainer>
          )}
          onPress={() => showTimePicker('duration')}
        />
        <List.Item
          title={<Text variant="titleMedium">Interval bells</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {getInterval(interval, 'm[m]')}
              </Text>
              <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
            </RowContainer>
          )}
          onPress={() => showTimePicker('interval')}
        />
        <List.Item
          title={<Text variant="titleMedium">Sound</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {`Bell ${bellId.split('_').pop()}`}
              </Text>
              <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
            </RowContainer>
          )}
          onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}
        />

        <RowContainer style={{ paddingRight: 15 }}>
          <IconButton
            icon="volume-minus"
            iconColor={onBackground}
            size={20}
            onPress={() => onBellVolumeChangeComplete(bellVolume - 0.1)}
          />
          <Slider
            style={{ flex: 1 }}
            value={bellVolume}
            onSlidingComplete={onBellVolumeChangeComplete}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={primary}
            maximumTrackTintColor={onBackground}
          />
          <IconButton
            icon="volume-plus"
            iconColor={primary}
            size={20}
            onPress={() => onBellVolumeChangeComplete(bellVolume + 0.1)}
          />
        </RowContainer>

        <Button
          icon="star-three-points-outline"
          mode="elevated"
          style={styles.buttonPlay}
          contentStyle={styles.buttonPlayContent}
          onPress={startSession}
        >
          Start
        </Button>
      </View>
      <Portal>
        <Modal
          visible={isShowSoundDialog}
          onDismiss={() => setIsShowSoundDialog(!isShowSoundDialog)}
          contentContainerStyle={{
            backgroundColor: elevation.level3,
            padding: 20,
            margin: 20,
            height: '80%',
          }}
        >
          <Text variant="headlineSmall">Choose a bell</Text>
          <ScrollView style={[styles.modalScrollView, { borderColor: outlineVariant }]}>
            <RadioButton.Group onValueChange={onBellChange} value={bellId}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                <RadioButton.Item key={`bell_${x}`} label={`Bell ${x}`} value={`bell_${x}`} />
              ))}
            </RadioButton.Group>
          </ScrollView>
          <View style={styles.modalActions}>
            <Button onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}>Ok</Button>
          </View>
        </Modal>
      </Portal>
    </WaveContainer>
  )
}

export default PresetScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  rightIcon: {
    marginLeft: 10,
  },
  buttonPlay: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 30,
  },
  buttonPlayContent: {
    flexDirection: 'row-reverse',
  },
  modalScrollView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -10,
  },
})
