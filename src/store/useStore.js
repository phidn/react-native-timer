import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageKeys } from '@config/storageKeys'
import { immer } from 'zustand/middleware/immer'
import logger from '@utilities/logger'

const themeSlice = (set) => ({
  isDarkMode: false,
  themeColor: 'Meditation Color 1',
  toggleMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }))
  },
  setThemeColor: (themeColor) => set({ themeColor }),
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

const navigationSlice = (set) => ({
  bottomActiveTab: '',
  setBottomActiveTab: (bottomActiveTab) => set({ bottomActiveTab }),
})

const store = (set) => ({
  ...themeSlice(set),
  ...prepareSlice(set),
  ...meditationSlice(set),
  ...sessionSlice(set),
  ...navigationSlice(set)
})

export const useStore = create(
  persist(immer(store), {
    name: storageKeys.appStorage,
    getStorage: () => AsyncStorage,
  })
)
