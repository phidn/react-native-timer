import en from '@/translations/en.json'
import vi from '@/translations/vi.json'

const availableLanguages = [
  { label: 'English', code: 'en' },
  { label: 'Vietnamese', code: 'vi' },
]

const availableCodes = availableLanguages.map((language) => language.code)

export { availableLanguages, availableCodes, en, vi }
