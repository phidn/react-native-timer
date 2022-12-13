import create from 'zustand'
import { persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { storageKeys } from '@config/storageKeys'

export const useStore = create(
  persist(
    (set, get, api) => ({
      /**
       * Theme
       */
      isDarkMode: undefined,
      themeColor: undefined,
      toggleMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }))
      },
      setThemeColor: (themeColor) => set({ themeColor }),
    }),
    {
      name: storageKeys.appStorage,
      getStorage: () => AsyncStorage,
    }
  )
)
