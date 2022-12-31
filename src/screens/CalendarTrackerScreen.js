import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { Button, List, Modal, Portal, Text, useTheme } from 'react-native-paper'
import { useStore } from '@/store/useStore'
import Color from 'color'
import dayjs from 'dayjs'
import { logger } from '@/utilities/logger'
import { isNumber, roundNumber } from '@/utilities/commonHelper'
import { useTranslation } from 'react-i18next'
import PageContainer from '@/components/Containers/PageContainer'
import { getAlphaByPercent } from '@/utilities/colorHelper'
import { COLOR_LEVELS } from '@/config/calendarHeatmap'
import { getMinText } from '@/utilities/timeHelper'

const CalendarTrackerScreen = () => {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()

  const [isShowSoundDialog, setIsShowSoundDialog] = useState(false)
  const [modalDatePressed, setModalDatePressed] = useState('')
  const [calendarKey, setCalendarKey] = useState(0)

  const sessions = useStore((state) => state.sessions)

  const markedDates = (() => {
    const result = {}
    for (const [key, value] of Object.entries(sessions)) {
      const totalTime = value.logs.reduce((accumulator, currentValue) => {
        const time = +currentValue.split('|')[0]
        if (isNumber(time)) {
          accumulator += time
        }
        return accumulator
      }, 0)

      const dots = value.logs.map((sessionLog) => {
        const [duration, ,] = sessionLog.split('|')
        const dotLevel = duration / 60
        const dotAlpha = getAlphaByPercent(dotLevel * 100)
        return { key: sessionLog, color: Color(colors.onSurface).alpha(dotAlpha).toString() }
      })

      const level = totalTime / 60
      const percent = level < 1 ? level * 100 : 100

      const findColorLevel = (percent) => {
        const colorArray = COLOR_LEVELS
        if (percent > 0 && percent <= 40) return colorArray[0]
        if (percent > 40 && percent < 60) return colorArray[1]
        if (percent >= 60 && percent < 80) return colorArray[2]
        if (percent > 80) return colorArray[3]
      }

      result[key] = {
        selected: true,
        selectedColor: findColorLevel(percent),
        selectedTextColor: colors.onPrimary,
        dots,
      }
    }
    const today = dayjs().format('YYYY-MM-DD')
    if (!result[today]) {
      result[today] = { dots: [{ color: colors.error }] }
    }
    return result
  })()

  useEffect(() => {
    if (i18n.resolvedLanguage) {
      LocaleConfig.locales[i18n.resolvedLanguage] = {
        monthNames: t('Time.monthNames').split('_'),
        monthNamesShort: t('Time.monthNamesShort').split('_'),
        dayNames: t('Time.dayNames').split('_'),
        dayNamesShort: t('Time.dayNamesShort').split('_'),
        amDesignator: 'AM',
        pmDesignator: 'PM',
      }

      LocaleConfig.defaultLocale = i18n.resolvedLanguage
      setCalendarKey(Math.random())
    }
  }, [i18n.resolvedLanguage])

  useEffect(() => {
    setCalendarKey(Math.random())
  }, [colors.primary])

  const onDayPress = ({ dateString }) => {
    if (sessions[dateString]) {
      setIsShowSoundDialog(true)
      setModalDatePressed(dateString)
    }
  }

  return (
    <PageContainer isScroll={true} style={{ padding: 20 }}>
      <Calendar
        key={calendarKey}
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType={'multi-dot'}
        theme={{
          backgroundColor: colors.surface,
          calendarBackground: colors.surface,
          selectedDotColor: colors.surface,

          textSectionTitleDisabledColor: colors.onSurfaceDisabled,
          textDisabledColor: colors.onSurfaceDisabled,
          disabledArrowColor: colors.onSurfaceDisabled,

          monthTextColor: colors.primary,
          indicatorColor: colors.primary,

          selectedDayTextColor: colors.onSurfaceVariant,
          selectedDayBackgroundColor: 'transparent',

          arrowColor: colors.tertiary,

          dayTextColor: colors.onSurfaceVariant,
          textSectionTitleColor: colors.onSurface,
        }}
      />
      {/* Modal meditation logs */}
      <Portal>
        <Modal
          visible={isShowSoundDialog}
          onDismiss={() => setIsShowSoundDialog(!isShowSoundDialog)}
          contentContainerStyle={{
            backgroundColor: colors.elevation.level3,
            padding: 20,
            margin: 20,
          }}
        >
          <Text variant="headlineSmall">{t('Statistics.CalendarTracker.meditation-log')}</Text>
          <ScrollView style={[styles.modalScrollView, { borderColor: colors.outlineVariant }]}>
            {sessions[modalDatePressed]?.logs.map((sessionLog) => {
              const [duration, started, ended] = sessionLog.split('|')
              const _duration = roundNumber(duration)
              return (
                <List.Item
                  key={sessionLog}
                  title={`${started} - ${ended}`}
                  left={(props) => <List.Icon {...props} icon="timer-outline" />}
                  right={() => (
                    <Text variant="titleMedium">
                      {_duration} {getMinText(_duration, i18n.resolvedLanguage)}
                    </Text>
                  )}
                />
              )
            })}
          </ScrollView>
          <View style={styles.modalActions}>
            <Button onPress={() => setIsShowSoundDialog(!isShowSoundDialog)}>Ok</Button>
          </View>
        </Modal>
      </Portal>
    </PageContainer>
  )
}

export default CalendarTrackerScreen

const styles = StyleSheet.create({
  modalScrollView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingVertical: 20,
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -10,
  },
})
