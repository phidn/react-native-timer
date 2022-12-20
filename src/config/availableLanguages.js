import en from '@/translations/en.json'
import vi from '@/translations/vi.json'
import de from '@/translations/de.json'

const availableLanguages = [
  { label: 'English', code: 'en' },
  { label: 'Vietnamese', code: 'vi' },
  { label: 'German', code: 'de' },
]

const availableCodes = availableLanguages.map((language) => language.code)

export { availableLanguages, availableCodes, en, vi, de }
