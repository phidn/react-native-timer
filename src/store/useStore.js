import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageKeys } from '@config/storageKeys'
import logger from '@utilities/logger'

export const useStore = create(
  persist(
    (set, get, api) => ({
      /**
       * Theme
       */
      isDarkMode: false,
      themeColor: 'Meditation Color 1',
      toggleMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }))
      },
      setThemeColor: (themeColor) => set({ themeColor }),

      /**
       * Prepare Screen
       */
      prepare: {
        duration: 60 * 30, // 30 minutes
        interval: 60 * 5, // 5 minutes
        bellId: 'bell_10',
        bellVolume: 0.5,
      },
      setPrepare: (payload) => {
        set((state) => ({ prepare: { ...state.prepare, ...payload } }))
      },

      /**
       * Meditation Screen
       */
      isShowCountdown: true,
      setIsShowCountdown: (isShowCountdown) => set({ isShowCountdown }),
    }),
    {
      name: storageKeys.appStorage,
      getStorage: () => AsyncStorage,
    }
  )
)
