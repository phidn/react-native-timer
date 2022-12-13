import create from 'zustand'

export const useMemory = create((set, get) => ({
  navigationIsReady: false,
  setNavigationIsReady: (navigationIsReady) => set({ navigationIsReady }),

  bottomTabMounted: false,
  setBottomTabMounted: (bottomTabMounted) => set({ bottomTabMounted }),
}))
