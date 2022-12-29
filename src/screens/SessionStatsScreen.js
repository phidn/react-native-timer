import React from 'react'
import { StyleSheet, View } from 'react-native'
import PageContainer from '@/components/Containers/PageContainer'
import { Card, Paragraph, Title, Text } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { logger } from '@/utilities/logger'
import { getDayString, getMinString } from '@/utilities/timeHelper'
import useStatsSessions from '@/hooks/useStatsSessions'

const SessionStatsScreen = () => {
  const { t, i18n } = useTranslation()

  const {
    numberOfSessions,
    avgSessionDuration,
    longestSession,
    shortestSession,
    currentStreak,
    longestStreak,
  } = useStatsSessions()

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
