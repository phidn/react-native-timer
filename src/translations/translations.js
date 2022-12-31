import { times } from './times'
import { commons } from './commons'
import { availableCodes, availableLanguages } from './availableTranslations'

const resources = {}

availableCodes.forEach((code) => {
  const translation = { ...commons[code], ...(times[code] || times.en) }
  resources[code] = { translation }
})

export { availableLanguages, availableCodes, resources }
