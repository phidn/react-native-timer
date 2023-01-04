const fs = require('fs')
const deepl = require('deepl-node')
require('dotenv').config()

const authKey = process.env.DEEPL_API_KEY
const translator = new deepl.Translator(authKey)

const enJson = require('../src/translations/common/en.json')
const { sourceLanguages } = require('./constants')

const translate = async (langCode) => {
  if (langCode === 'en') return enJson

  const enKeys = Object.keys(enJson)
  const enValues = Object.values(enJson)

  const results = await translator.translateText(enValues, 'en', langCode)
  const translated = {}
  enKeys.forEach((enKey, index) => (translated[enKey] = results[index]?.text || '### ERROR ###'))

  console.log(
    `>>> Complete translate ${langCode}: source ${enValues.length} target ${results.length}`
  )
  return translated
}

const bootTranslate = async () => {
  console.log(`Hello Alien. I'm Phidndev from the Earth.`)
  console.log('bootServer deepl ready')
  console.log('--------------')

  for (let i = 0; i < sourceLanguages.length; i++) {
    const lang = sourceLanguages[i]
    console.log(`Start translate: ${lang.name} (${lang.code})`)
    const translated = await translate(lang.code)
    translated.language = `${lang.name}_${lang.code}`
    fs.writeFileSync(`./server/output/${lang.code}.json`, JSON.stringify(translated, null, 2))
  }
}

const fix = async (langCode) => {
  // const _langCode = langCode === 'pt'? 'pt-PT' : langCode

  const enKeys = Object.keys(enJson)
  const translated = fs.readFileSync(`./server/origin/${langCode}.json`)
  const translatedJSON = JSON.parse(translated)

  const needFix = {}
  for (let i = 0; i < enKeys.length; i++) {
    const enKey = enKeys[i]
    if (!translatedJSON[enKey]) {
      needFix[enKey] = enJson[enKey]
    }
  }
  const needFixKeys = Object.keys(needFix)
  const needFixValues = Object.values(needFix)
  if (needFixValues.length) {
    console.log(`>> Found need fix: ${needFixKeys.length} text`)
    console.log('>>', needFixKeys.join(' | '))

    const needFixResults = await translator.translateText(needFixValues, 'en', langCode)
    needFixKeys.forEach((needFixKey, index) => {
      translatedJSON[needFixKey] = needFixResults[index].text || ''
    })
  }

  // Sort translatedJSON by enJSON
  const sortTranslatedJSON = {}
  for (let i = 0; i < enKeys.length; i++) {
    const enKey = enKeys[i]
    sortTranslatedJSON[enKey] = translatedJSON[enKey]
  }

  // Write sortTranslatedJSON to fix
  fs.writeFileSync(`./server/fix/${langCode}.json`, JSON.stringify(sortTranslatedJSON, null, 2))
}

const bootFix = async () => {
  console.log(`Hello Alien. I'm Phidndev from the Earth.`)
  console.log('bootFix deepl ready')
  console.log('--------------')

  for (let i = 0; i < sourceLanguages.length; i++) {
    const lang = sourceLanguages[i]
    console.log(`Start fix: ${lang.name} (${lang.code})`)
    await fix(lang.code)
  }
}

// bootServer()
bootFix()
