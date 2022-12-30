import viCommon from './common/vi.json'
import enCommon from './common/en.json'
import { times } from './times'

const en = { ...enCommon, ...times.en }
const vi = { ...viCommon, ...times.vi }

const availableLanguages = [
  { label: 'English', code: 'en' },
  { label: 'Vietnamese', code: 'vi' },
]

const availableCodes = availableLanguages.map((language) => language.code)

export { availableLanguages, availableCodes, en, vi }
