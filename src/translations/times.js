import dayjs from 'dayjs'

import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import 'dayjs/locale/bg'
import 'dayjs/locale/cs'
import 'dayjs/locale/da'
import 'dayjs/locale/de'
import 'dayjs/locale/el'
import 'dayjs/locale/es'
import 'dayjs/locale/et'
import 'dayjs/locale/fi'
import 'dayjs/locale/fr'
import 'dayjs/locale/hu'
import 'dayjs/locale/id'
import 'dayjs/locale/it'
import 'dayjs/locale/ja'
import 'dayjs/locale/lt'
import 'dayjs/locale/lv'
import 'dayjs/locale/nl'
import 'dayjs/locale/pl'
import 'dayjs/locale/pt'
import 'dayjs/locale/ro'
import 'dayjs/locale/ru'
import 'dayjs/locale/sk'
import 'dayjs/locale/sl'
import 'dayjs/locale/sv'
import 'dayjs/locale/tr'
import 'dayjs/locale/uk'
import 'dayjs/locale/zh'

import localeData from 'dayjs/plugin/localeData'
dayjs.extend(localeData)

import { availableCodes } from './availableTranslations'

const times = {}

availableCodes.forEach((code) => {
  dayjs.locale(code)
  times[code] = {
    'Time.monthNames': dayjs().localeData().months().join('_'),
    'Time.monthNamesShort': dayjs().localeData().monthsShort().join('_'),
    'Time.dayNames': dayjs().localeData().weekdays().join('_'),
    'Time.dayNamesShort': dayjs().localeData().weekdaysShort().join('_'),
  }
})

export { times }
