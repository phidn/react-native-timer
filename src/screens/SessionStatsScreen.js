import React from 'react'
import { StyleSheet, View } from 'react-native'
import PageContainer from '@/components/Containers/PageContainer'
import { Card, Paragraph, Title, Text, Divider, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { getDayText, getMinText } from '@/utilities/timeHelper'
import useStatsSessions from '@/hooks/useStatsSessions'
import color from 'color'

const SessionStatsScreen = () => {
  const { t, i18n } = useTranslation()
  const { colors } = useTheme()

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
      <Text variant="titleLarge" style={{ marginLeft: 5 }}>
        {t('StatsTopTabs.session.mindfulStreak')}
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>{t('StatsTopTabs.session.current-streak')}</Paragraph>
            <View style={styles.cardTwoText}>
              <Text variant="displaySmall">{currentStreak}</Text>
              <Text variant="bodyLarge" style={{ marginLeft: 5 }}>
                {getDayText(currentStreak, i18n.resolvedLanguage)}
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
                {getDayText(longestStreak, i18n.resolvedLanguage)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Divider
        horizontalInset={true}
        style={{
          height: 1,
          marginVertical: 20,
          backgroundColor: color(colors.primary).alpha(0.3).toString(),
        }}
      />

      <Text variant="titleLarge" style={{ marginLeft: 5 }}>
        {t('StatsTopTabs.session.mindfulSessions')}
      </Text>

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
                {getMinText(avgSessionDuration, i18n.resolvedLanguage)}
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
                {getMinText(longestSession, i18n.resolvedLanguage)}
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
                {getMinText(shortestSession, i18n.resolvedLanguage)}
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
