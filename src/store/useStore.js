import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageKeys } from '@/config/config'
import { logger } from '@/utilities/logger'

const rehydrateStorageSlice = (set) => ({
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
})

const themeSlice = (set) => ({
  isDarkMode: false,
  themeColor: 'purple',
  customColor: '',
  toggleMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }))
  },
  setThemeColor: (themeColor) => set({ themeColor }),
  setCustomColor: (customColor) => set({ customColor }),
})

const navigationSlice = (set) => ({
  bottomActiveTab: 'PrepareTab',
  setBottomActiveTab: (bottomActiveTab) => set({ bottomActiveTab }),
  statsTopInitTab: 'StatsTopTabs.chart',
  setStatsTopInitTab: (statsTopInitTab) => set({ statsTopInitTab }),
})

const prepareSlice = (set) => ({
  prepare: {
    duration: 60 * 30, // 30 minutes
    interval: 60 * 5, // 5 minutes
    bellId: 'bell_10',
    bellVolume: 0.5,
  },
  setPrepare: (payload) => {
    set((state) => {
      state.prepare = { ...state.prepare, ...payload }
    })
  },
})

const meditationSlice = (set) => ({
  isShowCountdown: true,
  setIsShowCountdown: (isShowCountdown) => set({ isShowCountdown }),
})

const sessionSlice = (set) => ({
  sessions: {},
  setSessions: (sessions) => set({ sessions }),
  setSessionLogs: (date, duration, started, ended) =>
    set((state) => {
      if (!state.sessions[date]?.logs) {
        state.sessions[date] = { logs: [] }
      }
      state.sessions[date].logs.push([duration, started, ended].join('|'))
    }),
  clearSession: () => set({ sessions: {} }),
})

const chartSlice = (set) => ({
  chartType: '1m',
  setChartType: (chartType) => set({ chartType }),
})

const userSlice = (set) => ({
  isPremium: false,
  setIsPremium: (isPremium) => set({ isPremium }),
})

const store = (set) => ({
  ...rehydrateStorageSlice(set),
  ...navigationSlice(set),
  ...themeSlice(set),
  ...prepareSlice(set),
  ...meditationSlice(set),
  ...sessionSlice(set),
  ...chartSlice(set),
  ...userSlice(set),
})

export const useStore = create(
  persist(immer(store), {
    name: storageKeys.appStorage,
    storage: createJSONStorage(() => AsyncStorage),
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    },
  })
)
