const fs = require('fs')
require('dotenv').config()
const { sourceLanguages } = require('./constants')
const enJson = require('../src/translations/common/en.json')
const translate = require('@iamtraction/google-translate')

const check = async (langCode) => {
  const enKeys = Object.keys(enJson)

  let fileName = langCode
  if (langCode === 'pt') {
    fileName = 'pt-PT'
  }
  const translated = fs.readFileSync(`./scripts/origin/${fileName}.json`)
  const translatedJSON = JSON.parse(translated)
  const needFix = []
  for (let i = 0; i < enKeys.length; i++) {
    const enKey = enKeys[i]
    if (enJson[enKey] === translatedJSON[enKey]) {
      needFix.push({ langCode, enKey, text: translatedJSON[enKey] })
    }
  }
  if (needFix.length) {
    const needTranslateText = needFix.map(x => x.text).join(' | ')
    console.log('>> needTranslateText:', needTranslateText)
    translate(needTranslateText, { from: 'en', to: langCode })
      .then((res) => {
        console.log('>> translatedText:', res.text)
        const translatedArray = res.text.split(' | ')
        const fixJSON = {}
        for (let i = 0; i < needFix.length; i++) {
          const { enKey } = needFix[i];
          fixJSON[enKey] = translatedArray[i]
        }
        fs.writeFileSync(`./scripts/fix/${langCode}.json`, JSON.stringify(fixJSON, null, 2))
      })
      .catch((err) => console.log('>> translate err:', err))
  }
}

const bootServer = async () => {
  console.log(`Hello Alien. I'm Phidndev from the Earth.`)
  console.log('bootServer check translate ready')
  console.log('--------------')

  for (let i = 0; i < sourceLanguages.length; i++) {
    const lang = sourceLanguages[i]
    console.log(`Start check: ${lang.name} (${lang.code})`)
    await check(lang.code)
  }

}

bootServer()
