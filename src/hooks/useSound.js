import { useEffect, useState } from 'react'
import Sound from 'react-native-sound'
import { logger0 as logger } from '@/utilities/logger'
import { getAsset } from '@/utilities/assetsHelper'

const useSound = () => {
  const [playbackInstance, setPlaybackInstance] = useState(null)

  useEffect(() => {
    Sound.setCategory('Playback')
  }, [])

  const playAsync = (soundFile, volume = 1, interrupt = false) => {
    return new Promise((resolve, reject) => {
      // Release playback instance if exists
      if (interrupt && playbackInstance) {
        release()
      }

      const whoosh = new Sound(soundFile, (error) => {
        if (error) {
          logger('failed to load the sound', error, 'error')
          return
        }

        logger('loaded, duration in seconds', whoosh.getDuration())
        whoosh.setVolume(volume)
        setPlaybackInstance(whoosh)

        whoosh.play((success) => {
          if (success) {
            logger('finished playing')
          } else {
            logger('playback failed due to audio decoding errors')
          }
          if (interrupt) {
            release()
          }
          resolve()
        })
      })
    })
  }

  const play = async (soundFile, volume = 1, numberOfLoops = 1) => {
    for (let i = 0; i < numberOfLoops; i++) {
      await playAsync(soundFile, volume, numberOfLoops === i + 1)
    }
  }

  const playLongBell = async (bellId, bellVolume) => {
    await play(getAsset(bellId + '_long'), bellVolume)
  }
  const playShortBell = async (bellId, bellVolume, number = 1) => {
    await play(getAsset(bellId + '_short'), bellVolume, number)
  }

  const release = () => {
    if (playbackInstance) {
      playbackInstance.release()
      setPlaybackInstance(null)
    }
    logger('>>> released playback')
  }

  return { play, playLongBell, playShortBell, release }
}

export default useSound
