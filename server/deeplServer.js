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
  console.log('bootServer deepl ready')
  console.log('--------------')

  const sourceLanguages = await translator.getSourceLanguages()
  
  for (let i = 0; i < sourceLanguages.length; i++) {
    const lang = sourceLanguages[i]
    if (lang.code === 'en') continue
    console.log(`Start translate: ${lang.name} (${lang.code})`)

    // const translated = await translate(lang.code)
    // translated.language = `${lang.name}_${lang.code}`
    // fs.writeFileSync(`./server/output/${lang.code}.json`, JSON.stringify(translated, null, 2))
  }
}

bootServer()
