module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@store': './src/store',
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
}
