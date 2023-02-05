import { logger } from './logger'

export const getAsset = (assetKey) => {
  switch (assetKey) {
    case 'Bell_1_short':
      return require('@/assets/soundsv2/Bell_1_short.mp3')
    case 'Bell_1_long':
      return require('@/assets/soundsv2/Bell_1_long.mp3')

    case 'Bell_2_short':
      return require('@/assets/soundsv2/Bell_2_short.mp3')
    case 'Bell_2_long':
      return require('@/assets/soundsv2/Bell_2_long.mp3')

    case 'Bell_A_short':
    case 'Bell_A_long':
      return require('@/assets/soundsv2/Bell_A.mp3')

    case 'Bell_Meditation_Cleaned_short':
      return require('@/assets/soundsv2/Bell_Meditation_Cleaned_short.mp3')
    case 'Bell_Meditation_Cleaned_long':
      return require('@/assets/soundsv2/Bell_Meditation_Cleaned_long.mp3')

    case 'Bell_Meditation_short':
      return require('@/assets/soundsv2/Bell_Meditation_short.mp3')
    case 'Bell_Meditation_long':
      return require('@/assets/soundsv2/Bell_Meditation_long.mp3')

    case 'Meditation_Bowls_short':
    case 'Meditation_Bowls_long':
      return require('@/assets/soundsv2/Meditation_Bowls.mp3')

    case 'Singing_bowl_hit_1_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_1_short.mp3')
    case 'Singing_bowl_hit_1_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_1_long.mp3')

    case 'Singing_bowl_hit_2_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_2_short.mp3')
    case 'Singing_bowl_hit_2_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_2_long.mp3')

    case 'Singing_bowl_hit_3_short':
      return require('@/assets/soundsv2/Singing_bowl_hit_3_short.mp3')
    case 'Singing_bowl_hit_3_long':
      return require('@/assets/soundsv2/Singing_bowl_hit_3_long.mp3')

    case 'Singing_Bowl_Male_Frequency_short':
      return require('@/assets/soundsv2/Singing_Bowl_Male_Frequency_short.mp3')
    case 'Singing_Bowl_Male_Frequency_long':
      return require('@/assets/soundsv2/Singing_Bowl_Male_Frequency_long.mp3')

    case 'Singing_Bowl_short':
      return require('@/assets/soundsv2/Singing_Bowl_short.mp3')
    case 'Singing_Bowl_long':
      return require('@/assets/soundsv2/Singing_Bowl_long.mp3')

    case 'Singing_Bowl_Tibetan_short':
    case 'Singing_Bowl_Tibetan_long':
      return require('@/assets/soundsv2/Singing_Bowl_Tibetan.mp3')
  }

  logger('getAsset error', assetKey)
  return require('@/assets/soundsv2/Bell_1_short.mp3')
  return null
}
