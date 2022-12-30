import AsyncStorage from '@react-native-async-storage/async-storage'
import * as RNLocalize from 'react-native-localize'
import { storageKeys } from '@/config/storageKeys'
import { logger } from './logger'
import { availableCodes } from '@/translations/translations'


const languageDetector = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function (callback) {
    try {
      await AsyncStorage.getItem(storageKeys.appLanguage).then((language) => {
        if (language) {
          return callback(language)
        } else {
          throw new Error('No language is set, choosing the best available or English as fallback')
        }
      })
    } catch (error) {
      logger('languageDetector detect error', error)
      const bestLanguage = RNLocalize.findBestAvailableLanguage(availableCodes)
      return callback(bestLanguage.languageTag || 'en')
    }
  },
  cacheUserLanguage: async function (language) {
    try {
      await AsyncStorage.setItem(storageKeys.appLanguage, language)
    } catch (error) {
      logger('languageDetector cacheUserLanguage error', error)
    }
  },
}

export { languageDetector }
