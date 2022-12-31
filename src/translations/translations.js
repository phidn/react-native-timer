import viCommon from './common/vi.json'
import enCommon from './common/en.json'
import deCommon from './common/de.json'
import { times } from './times'

const vi = { ...viCommon, ...times.vi }
const en = { ...enCommon, ...times.en }
const de = { ...deCommon, ...times.de || times.en }

const resources = {
  vi: { translation: vi },
  en: { translation: en },
  de: { translation: de },
}

export * from './availableTranslations'
export { resources }

