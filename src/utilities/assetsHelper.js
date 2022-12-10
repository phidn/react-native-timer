import logger from './logger'

export const getAsset = (assetKey) => {
  switch (assetKey) {
    case 'bell_1_short':
      return require('@assets/sounds/bell_1_short.mp3')
    case 'bell_1_long':
      return require('@assets/sounds/bell_1_long.mp3')

    case 'bell_2_short':
      return require('@assets/sounds/bell_2_short.mp3')
    case 'bell_2_long':
      return require('@assets/sounds/bell_2_long.mp3')

    case 'bell_3_short':
      return require('@assets/sounds/bell_3_short.mp3')
    case 'bell_3_long':
      return require('@assets/sounds/bell_3_long.mp3')

    case 'bell_4_short':
      return require('@assets/sounds/bell_4_short.mp3')
    case 'bell_4_long':
      return require('@assets/sounds/bell_4_long.mp3')

    case 'bell_5_short':
      return require('@assets/sounds/bell_5_short.mp3')
    case 'bell_5_long':
      return require('@assets/sounds/bell_5_long.mp3')

    case 'bell_6_short':
    case 'bell_6_long':
      return require('@assets/sounds/bell_6.mp3')

    case 'bell_7_short':
      return require('@assets/sounds/bell_7_short.mp3')
    case 'bell_7_long':
      return require('@assets/sounds/bell_7_long.mp3')

    case 'bell_8_short':
      return require('@assets/sounds/bell_8_short.mp3')
    case 'bell_8_long':
      return require('@assets/sounds/bell_8_long.mp3')

    case 'bell_9_short':
      return require('@assets/sounds/bell_9_short.mp3')
    case 'bell_9_long':
      return require('@assets/sounds/bell_9_long.mp3')

    case 'bell_10_short':
    case 'bell_10_long':
      return require('@assets/sounds/bell_10.mp3')
  }

  logger('not found bell asset', bell, 'error')
  return null
}
