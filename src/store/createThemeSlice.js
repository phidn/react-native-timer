export const createThemeSlice = (set) => ({
  isDarkMode: true,
  themeColor: 'Meditation Color 1',
  toggleMode: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }))
  },
  setThemeColor: (themeColor) => {
    set({ themeColor })
  }
})
