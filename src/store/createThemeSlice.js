export const createThemeSlice = (set) => ({
  isDarkMode: true,
  toggleTheme: () => {
    set((state) => ({ isDarkMode: !state.isDarkMode }))
  },
})
