import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Slider from '@react-native-community/slider'
import { useTranslation } from 'react-i18next'

import RowContainer from '@/components/Containers/RowContainer'
import CalendarHeatmap from '@/components/CalendarHeatmap/CalendarHeatmap'

import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(weekOfYear)
dayjs.extend(duration)
dayjs.extend(relativeTime)

import useSound from '@/hooks/useSound'
import { getDayText, getMinText } from '@/utilities/timeHelper'
import { getAsset } from '@/utilities/assetsHelper'
import { logger } from '@/utilities/logger'
import { COLOR_LEVELS } from '@/config/calendarHeatmap'
import { useStore } from '@/store/useStore'
import { initPicker } from '@/config/initPicker'
import { isNumber, roundNumber } from '@/utilities/commonHelper'
import Color from 'color'
import CenterContainer from '@/components/Containers/CenterContainer'
import TopBannerAdContainer from '@/components/Containers/TopBannerAdContainer'

import { getAlphaByPercent } from '@/utilities/colorHelper'
import useStatsSessions from '@/hooks/useStatsSessions'

const PrepareScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation()
  const { elevation, primary, onBackground, outlineVariant } = useTheme().colors
  const { colors } = useTheme()
  const { play, release } = useSound()

  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)
  const { duration, interval, bellId, bellVolume } = useStore((state) => state.prepare)
  const setPrepare = useStore((state) => state.setPrepare)
  const sessions = useStore((state) => state.sessions)

  const { avgSessionDuration, longestStreak } = useStatsSessions()

  const calendarHeatmapValues = (() => {
    const result = []
    for (const [key, value] of Object.entries(sessions)) {
      const totalTime = value.logs.reduce((accumulator, currentValue) => {
        const time = +currentValue.split('|')[0]
        if (isNumber(time)) {
          accumulator += time
        }
        return accumulator
      }, 0)

      const level = totalTime / 90
      const percent = level < 1 ? level * 100 : 100
      const alpha = getAlphaByPercent(level * 100)

      result.push({
        date: key,
        selectedColor: Color(colors.tertiary).alpha(alpha).toString(),
        count: level,
        percent,
      })
    }

    const today = dayjs().format('YYYY-MM-DD')
    if (!sessions[today]) {
      result.push({ date: today, count: -1 })
    }
    return result
  })()

  const setDuration = (duration) => setPrepare({ duration })
  const setInterval = (interval) => setPrepare({ interval })
  const setBellId = (bellId) => setPrepare({ bellId })
  const setBellVolume = (bellVolume) => setPrepare({ bellVolume })

  // logger({ duration, interval, bellId, bellVolume })

  const showTimePicker = (type) => {
    const onChange = (event, value) => {
      if (event.type === 'dismissed') return

      if (type === 'duration') {
        setDuration((value.getTime() - initPicker.time) / 1000)
      } else {
        setInterval((value.getTime() - initPicker.time) / 1000)
      }
    }

    const initTime = type === 'duration' ? initPicker.duration : initPicker.interval
    const value = new Date(initTime)
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

  const endWeek = dayjs().endOf('month').week() + 1
  const endWeekday = dayjs().week(endWeek).day(6)

  const { width } = useWindowDimensions()
  const numDays = roundNumber((width - 40 - 100) / 15) * 7

  return (
    <TopBannerAdContainer style={{ margin: 20, marginLeft: 30 }}>
      <List.Item
        title={<Text variant="titleMedium">{t('Prepare.duration')}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: primary }]}>
              {String(`${duration / 60} `).padStart(4, ' ')}
              {getMinText(duration / 60, i18n.resolvedLanguage)}
            </Text>
            <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
          </RowContainer>
        )}
        onPress={() => showTimePicker('duration')}
      />
      <List.Item
        title={<Text variant="titleMedium">{t('Prepare.invite-bell')}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: primary }]}>
              {String(`${interval / 60} `).padStart(4, ' ')}
              {getMinText(interval / 60, i18n.resolvedLanguage)}
            </Text>
            <Feather color={primary} name="chevron-right" size={24} style={styles.rightIcon} />
          </RowContainer>
        )}
        onPress={() => showTimePicker('interval')}
      />
      <List.Item
        title={<Text variant="titleMedium">{t('Prepare.sound')}</Text>}
        right={() => (
          <RowContainer>
            <Text variant="titleMedium" style={[{ color: primary }]}>
              {bellId !== 'bell_default' && `${t('Prepare.bell')} ${bellId.split('_').pop()}`}
              {bellId === 'bell_default' && t('Prepare.defaultBell')}
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

      <Button icon="heart-flash" mode="elevated" style={styles.buttonPlay} onPress={startSession}>
        {t('Prepare.start')}
      </Button>

      {/* Heatmap */}
      <View style={styles.heatmapContainer}>
        <CalendarHeatmap endDate={endWeekday} numDays={numDays} values={calendarHeatmapValues} />
      </View>
      <CenterContainer>
        <View style={{ marginTop: 20, alignItems: 'baseline' }}>
          <RowContainer style={{ marginRight: 15 }}>
            <FontAwesome5 name={'seedling'} style={{ marginRight: 5, color: COLOR_LEVELS[1] }} />
            <Text variant="labelSmall">{t('StatsTopTabs.session.avg-duration')}</Text>
            <Text variant="labelSmall">
              {`: ${avgSessionDuration} `}
              {getMinText(avgSessionDuration, i18n.resolvedLanguage)}
            </Text>
          </RowContainer>
          <RowContainer>
            <FontAwesome5 name={'seedling'} style={{ marginRight: 5, color: COLOR_LEVELS[2] }} />
            <Text variant="labelSmall">{t('StatsTopTabs.session.longest-streak')}</Text>
            <Text variant="labelSmall">
              {`: ${longestStreak} `}
              {getDayText(longestStreak, i18n.resolvedLanguage)}
            </Text>
          </RowContainer>
        </View>
      </CenterContainer>

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
              <RadioButton.Item
                key={'bell_default'}
                label={t('Prepare.defaultBell')}
                value={'bell_default'}
              />
              {[1, 2, 3].map((x) => (
                <RadioButton.Item
                  key={`bell_${x}`}
                  label={`${t('Prepare.bell')} ${x}`}
                  value={`bell_${x}`}
                />
              ))}
              {[4, 5, 6, 7, 8, 9].map((x) => (
                <RadioButton.Item
                  key={`bell_${x}`}
                  label={`${t('Prepare.bell')} ${x}`}
                  value={`bell_${x}`}
                  disabled={true}
                />
              ))}
            </RadioButton.Group>
          </ScrollView>
          <View style={styles.modalActions}>
            <Button onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}>Ok</Button>
          </View>
        </Modal>
      </Portal>
    </TopBannerAdContainer>
  )
}

export default PrepareScreen

const styles = StyleSheet.create({
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
  heatmapContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -25,
  },
})
