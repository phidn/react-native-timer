import { useStore } from '@/store/useStore'
import { calcTotalTime } from '@/utilities/sessionHelper'
import { isNumber, roundNumber } from '@/utilities/commonHelper'
import { summary } from '@/utilities/dateStreaks'

const useStatsSessions = () => {
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

    if (shortSession === 999999999999999) shortSession = 0
    return [longSession, shortSession]
  }

  const summaryStreak = () => {
    const dates = Object.keys(sessions).map((date) => new Date(date))
    return summary({ dates })
  }

  const numberOfSessions = getNumberOfSessions()
  const avgSessionDuration = getAvgSessionDuration()
  const [longestSession, shortestSession] = getLongShortSession()
  const { currentStreak, longestStreak } = summaryStreak()

  return {
    numberOfSessions,
    avgSessionDuration,
    longestSession,
    shortestSession,
    currentStreak,
    longestStreak
  }
}

export default useStatsSessions
