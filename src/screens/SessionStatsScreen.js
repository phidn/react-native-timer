import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import PageContainer from '@/components/Containers/PageContainer'
import { Card, Paragraph, Title, Text } from 'react-native-paper'
import { useStore } from '@/store/useStore'
import { calcTotalTime } from '@/utilities/sessionHelper'
import { isNumber, roundNumber } from '@/utilities/commonHelper'
import summary from '@/utilities/dateStreaks'
import { useTranslation } from 'react-i18next'
import { logger } from '@/utilities/logger'
import dayjs from 'dayjs'
import { getDayString, getMinString } from '@/utilities/timeHelper'

const SessionStatsScreen = () => {
  const { t, i18n } = useTranslation()
  const sessions = useStore((state) => state.sessions)
  
  const getNumberOfSessions = () => {
    let result = 0
    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      result += sessions[date].logs.length || 0
    }
    return result
  }

  const getAvgSessionDuration = () => {
    let totalTime = 0,
      totalSessions = 0

    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      totalTime += calcTotalTime(sessions[date])
      totalSessions += sessions[date].logs.length || 0
    }
    if (totalSessions === 0) {
      return 0
    }
    return roundNumber(totalTime / totalSessions)
  }

  const getLongShortSession = () => {
    let longSession = 0,
      shortSession = 999999999999999

    const dates = Object.keys(sessions)
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i]
      if (sessions[date]?.logs?.length) {
        for (let i = 0; i < sessions[date].logs.length; i++) {
          const duration = +sessions[date].logs[i].split('|')[0]
          if (isNumber(duration)) {
            if (longSession < duration) longSession = duration
            if (duration < shortSession) shortSession = duration
          }
        }
      }
    }

    return [longSession, shortSession]
  }

  const summaryStreak = () => {
    const dates = Object.keys(sessions).map(date => new Date(date))
    return summary({ dates })
  }

  const numberOfSessions = getNumberOfSessions()
  const avgSessionDuration = getAvgSessionDuration()
  const [longestSession, shortestSession] = getLongShortSession()
  const {currentStreak, longestStreak} = summaryStreak()

  return (
    <PageContainer style={{ padding: 5, paddingTop: 30 }}>
      {/* Streak */}
      <View style={{ flexDirection: 'row' }}>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.current-streak')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{currentStreak}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getDayString(currentStreak, t, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.longest-streak')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{longestStreak}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getDayString(longestStreak, t, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Number of sessions | Avg */}
      <View style={{ flexDirection: 'row' }}>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.number-of-sessions')}</Paragraph>
            <Text variant="displaySmall">{numberOfSessions}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.avg-duration')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{avgSessionDuration}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getMinString(avgSessionDuration, t, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Longest | Shortest */}
      <View style={{ flexDirection: 'row' }}>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.longest-session')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{longestSession}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getMinString(longestSession, t, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.shortest-session')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{shortestSession}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getMinString(shortestSession, t, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
  },
  cardTwoText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})

export default SessionStatsScreen
