import { useEffect, useState } from 'react'
import Sound from 'react-native-sound'
import logger from '@utilities/logger'

const useSound = () => {
  const [playbackInstance, setPlaybackInstance] = useState(null)

  useEffect(() => {
    Sound.setCategory('Playback')
  }, [])

  const playAsync = (soundFile, volume = 1, interrupt = false) => {
    console.log('→ playAsync interrupt:', interrupt)
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

  const release = () => {
    if (playbackInstance) {
      playbackInstance.release()
      setPlaybackInstance(null)
    }
    logger('>>> released playback')
  }

  return { play, release }
}

export default useSound
