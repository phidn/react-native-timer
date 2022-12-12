import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import {
  Text,
  List,
  useTheme,
  RadioButton,
  Button,
  IconButton,
  Modal,
  Portal,
} from 'react-native-paper'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import Feather from 'react-native-vector-icons/Feather'
import Slider from '@react-native-community/slider'
import { useTranslation } from 'react-i18next'
import Color from 'color'

import RowContainer from '@components/Containers/RowContainer'
import CalendarHeatmap from '@components/CalendarHeatmap/CalendarHeatmap'
import WaveContainer from '@components/Containers/WaveContainer'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import duration from 'dayjs/plugin/duration'
dayjs.extend(weekOfYear)
dayjs.extend(duration)

import useSound from '@hooks/useSound'
import { getDuration, getInterval } from '@utilities/timeHelper'
import { getAsset } from '@utilities/assetsHelper'
import logger from '@utilities/logger'

const min_30 = 60 * 30 * 1000
const min_5 = 60 * 5 * 1000
const initTime = 1640970000000
const initDuration = initTime + min_30
const initInterval = initTime + min_5

const PresetScreen = ({ navigation }) => {
  const { elevation, primary, onBackground, outlineVariant, secondary, tertiary } =
    useTheme().colors
  const { play, release } = useSound()

  const { t } = useTranslation()

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

  const onBellChange = (value) => {
    setBellId(value)
    play(getAsset(value + '_short'), bellVolume)
  }

  const onBellVolumeChangeComplete = (value) => {
    setBellVolume(value)
    play(getAsset(bellId + '_short'), value)
  }

  const startSession = () => {
    release()
    navigation.navigate('MeditationTimerScreen', {
      duration,
      interval,
      bellId,
      bellVolume,
    })
  }

  const endWeek = dayjs().endOf('month').week()
  const endWeekday = dayjs().week(endWeek).day(6)
  const startWeekday = dayjs().week(endWeek).subtract(12, 'weeks').startOf('day')
  const diffDay = endWeekday.diff(startWeekday, 'd') + 2

  // logger({
  //   endWeek,
  //   startWeek: dayjs().week(endWeek).subtract(12, 'weeks').week(),
  //   endWeekday,
  //   startWeekday,
  //   diffDay
  // })

  return (
    <WaveContainer>
      <ScrollView style={styles.container}>
        <List.Item
          title={<Text variant="titleMedium">{t('Prepare.duration')}</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {getDuration(duration, t)}
              </Text>
              <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
            </RowContainer>
          )}
          onPress={() => showTimePicker('duration')}
        />
        <List.Item
          title={<Text variant="titleMedium">{t('Prepare.interval-bells')}</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {getInterval(interval, t)}
              </Text>
              <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
            </RowContainer>
          )}
          onPress={() => showTimePicker('interval')}
        />
        <List.Item
          title={<Text variant="titleMedium">{t('Prepare.sound')}</Text>}
          right={() => (
            <RowContainer style={{}}>
              <Text variant="titleMedium" style={[{ color: primary }]}>
                {`${t('Prepare.bell')} ${bellId.split('_').pop()}`}
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
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={startSession}
        >
          {t('Prepare.start')}
        </Button>

        {/* Heatmap */}
        <View style={styles.calendarHeatmapContainer}>
          <CalendarHeatmap
            endDate={endWeekday}
            numDays={diffDay}
            values={[
              { date: '2022-12-12', count: 9 },
              { date: '2022-12-11', count: 20 },
              { date: '2022-12-10', count: 1 },
            ]}
            labelColor={secondary}
            colorArray={[
              Color(tertiary).alpha(0.1).toString(),
              Color(tertiary).alpha(0.4).toString(),
              Color(tertiary).alpha(0.6).toString(),
              Color(tertiary).alpha(0.8).toString(),
              Color(tertiary).alpha(1).toString(),
            ]}
          />
        </View>
      </ScrollView>

      {/* Modal choose bell sound */}
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
          <Text variant="headlineSmall">{t('Prepare.choose-a-bell')}</Text>
          <ScrollView style={[styles.modalScrollView, { borderColor: outlineVariant }]}>
            <RadioButton.Group onValueChange={onBellChange} value={bellId}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
                <RadioButton.Item
                  key={`bell_${x}`}
                  label={`${t('Prepare.bell')} ${x}`}
                  value={`bell_${x}`}
                />
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
    paddingHorizontal: 30,
  },
  rightIcon: {
    marginLeft: 10,
  },
  buttonPlay: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 30,
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
  calendarHeatmapContainer: {
    marginTop: 30,
    // marginLeft: 20,
    // marginRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
