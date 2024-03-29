import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { languageDetector } from '@/utilities/languageDetector'
import { resources } from '@/translations/translations'

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
