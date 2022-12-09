import AsyncStorage from '@react-native-async-storage/async-storage'
import * as RNLocalize from 'react-native-localize'
import { storageKeys } from '@config/storageKeys'
import logger from './logger'
import availableLanguages from '@config/availableLanguages'

const languageDetector = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function (callback) {
    try {
      await AsyncStorage.getItem(storageKeys.appLang).then((language) => {
        if (language) {
          return callback(language)
        } else {
          const bestLanguage = RNLocalize.findBestAvailableLanguage(
            availableLanguages.map((x) => x.code)
          )
          return callback(bestLanguage.languageTag)
        }
      })
    } catch (error) {
      logger('languageDetector detect error', error)
    }
  },
  cacheUserLanguage: async function (language) {
    try {
      await AsyncStorage.setItem(storageKeys.appLang, language)
    } catch (error) {
      logger('languageDetector cacheUserLanguage error', error)
    }
  },
}

export { languageDetector }
