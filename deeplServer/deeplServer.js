const fs = require('fs')
const deepl = require('deepl-node')
require('dotenv').config()

const authKey = process.env.DEEPL_API_KEY
const translator = new deepl.Translator(authKey)

const enJson = require('../src/translations/common/en.json')

const translate = async (langCode) => {
  if (langCode === 'en') return enJson
  
  const enKeys = Object.keys(enJson)
  const enValues = Object.values(enJson)

  const results = await translator.translateText(enValues, 'en', langCode)
  const translated = {}
  enKeys.forEach((enKey, index) => translated[enKey] = results[index]?.text || '### ERROR ###')
  
  console.log(`>>> Complete translate ${langCode}: source ${enValues.length} target ${results.length}`)
  return translated

}

const bootServer = async () => {
  console.log(`Hello Alien. I'm Phidndev from the Earth.`)

  const sourceLanguages = await translator.getSourceLanguages()
  
  for (let i = 0; i < sourceLanguages.length; i++) {
    const lang = sourceLanguages[i]
    if (lang.code === 'en') continue
    console.log(`Start translate: ${lang.name} (${lang.code})`)

    // const translated = await translate(lang.code)
    // translated.language = `${lang.name}_${lang.code}`
    // fs.writeFileSync(`./deeplServer/output/${lang.code}.json`, JSON.stringify(translated, null, 2))
  }
}

bootServer()


// const sourceLanguages = [
//   { name: 'Bulgarian', code: 'bg', supportsFormality: undefined },
//   { name: 'Czech', code: 'cs', supportsFormality: undefined },
//   { name: 'Danish', code: 'da', supportsFormality: undefined },
//   { name: 'German', code: 'de', supportsFormality: undefined },
//   { name: 'Greek', code: 'el', supportsFormality: undefined },
//   // { name: 'English', code: 'en', supportsFormality: undefined },
//   { name: 'Spanish', code: 'es', supportsFormality: undefined },
//   { name: 'Estonian', code: 'et', supportsFormality: undefined },
//   { name: 'Finnish', code: 'fi', supportsFormality: undefined },
//   { name: 'French', code: 'fr', supportsFormality: undefined },
//   { name: 'Hungarian', code: 'hu', supportsFormality: undefined },
//   { name: 'Indonesian', code: 'id', supportsFormality: undefined },
//   { name: 'Italian', code: 'it', supportsFormality: undefined },
//   { name: 'Japanese', code: 'ja', supportsFormality: undefined },
//   { name: 'Lithuanian', code: 'lt', supportsFormality: undefined },
//   { name: 'Latvian', code: 'lv', supportsFormality: undefined },
//   { name: 'Dutch', code: 'nl', supportsFormality: undefined },
//   { name: 'Polish', code: 'pl', supportsFormality: undefined },
//   { name: 'Portuguese', code: 'pt-PT', supportsFormality: undefined },
//   { name: 'Romanian', code: 'ro', supportsFormality: undefined },
//   { name: 'Russian', code: 'ru', supportsFormality: undefined },
//   { name: 'Slovak', code: 'sk', supportsFormality: undefined },
//   { name: 'Slovenian', code: 'sl', supportsFormality: undefined },
//   { name: 'Swedish', code: 'sv', supportsFormality: undefined },
//   { name: 'Turkish', code: 'tr', supportsFormality: undefined },
//   { name: 'Ukrainian', code: 'uk', supportsFormality: undefined },
//   { name: 'Chinese', code: 'zh', supportsFormality: undefined }
// ]