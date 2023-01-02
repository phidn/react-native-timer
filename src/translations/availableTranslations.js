export const availableLanguages = [
  { name: 'Vietnamese', code: 'vi' },
  { name: 'English', code: 'en' },
  { name: 'Bulgarian', code: 'bg' },
  { name: 'Czech', code: 'cs' },
  { name: 'Danish', code: 'da' },
  { name: 'German', code: 'de' },
  { name: 'Greek', code: 'el' },
  { name: 'Spanish', code: 'es' },
  { name: 'Estonian', code: 'et' },
  { name: 'Finnish', code: 'fi' },
  { name: 'French', code: 'fr' },
  { name: 'Hungarian', code: 'hu' },
  { name: 'Indonesian', code: 'id' },
  { name: 'Italian', code: 'it' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Lithuanian', code: 'lt' },
  { name: 'Latvian', code: 'lv' },
  { name: 'Dutch', code: 'nl' },
  { name: 'Polish', code: 'pl' },
  { name: 'Portuguese', code: 'pt-PT' },
  { name: 'Romanian', code: 'ro' },
  { name: 'Russian', code: 'ru' },
  { name: 'Slovak', code: 'sk' },
  { name: 'Slovenian', code: 'sl' },
  { name: 'Swedish', code: 'sv' },
  { name: 'Turkish', code: 'tr' },
  { name: 'Ukrainian', code: 'uk' },
  { name: 'Chinese', code: 'zh' }
]

export const availableCodes = availableLanguages.map((language) => language.code)

export const getLanguageName = (code) => {
  const language = availableLanguages.find(x => x.code === code)
  if (language) return language.name
  return ''
}
