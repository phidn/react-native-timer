import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { createThemeSlice } from './createThemeSlice'

export const useStore = create(
  persist(
    (set, get, api) => ({
      ...createThemeSlice(set, get, api),
    }),
    {
      name: 'appStorage',
      getStorage: () => AsyncStorage,
    }
  )
)
