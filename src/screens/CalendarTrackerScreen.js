import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { Button, List, Modal, Portal, Text, useTheme } from 'react-native-paper'
import { useStore } from '@store/useStore'
import Color from 'color'
import dayjs from 'dayjs'
import logger from '@utilities/logger'
import { isNumber } from '@utilities/commonHelper'
import { useTranslation } from 'react-i18next'
import PageContainer from '@components/Containers/PageContainer'

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
      const level = totalTime / 60

      const dots = value.logs.map((sessionLog) => {
        const [duration, ,] = sessionLog.split('|')
        const _level = duration / 60
        return { key: sessionLog, color: Color(colors.onSurface).alpha(_level).toString() }
      })
      result[key] = {
        selected: true,
        selectedColor: Color(colors.tertiary).alpha(level).toString(),
        selectedTextColor: colors.onTertiary,
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
        monthNames: t('Calendar.monthNames').split('_'),
        monthNamesShort: t('Calendar.monthNamesShort').split('_'),
        dayNames: t('Calendar.dayNames').split('_'),
        dayNamesShort: t('Calendar.dayNamesShort').split('_'),
        amDesignator: t('Calendar.amDesignator'),
        pmDesignator: t('Calendar.pmDesignator'),
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
    <PageContainer paddingHorizontal={20} isScroll={true}>
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
          <Text variant="headlineSmall">{t('Statistics.meditation-log')}</Text>
          <ScrollView style={[styles.modalScrollView, { borderColor: colors.outlineVariant }]}>
            {sessions[modalDatePressed]?.logs.map((sessionLog) => {
              const [duration, started, ended] = sessionLog.split('|')
              return (
                <List.Item
                  key={sessionLog}
                  title={`${started} - ${ended}`}
                  left={(props) => <List.Icon {...props} icon="timer-outline" />}
                  right={() => (
                    <Text variant="titleMedium">
                      {duration} {t('Time.minutes')}
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