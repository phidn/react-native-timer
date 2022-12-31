import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
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
