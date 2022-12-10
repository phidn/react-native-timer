import { useEffect, useState } from 'react'
import Sound from 'react-native-sound'
import logger from '@utilities/logger'

const useSound = () => {
  const [playbackInstance, setPlaybackInstance] = useState(null)

  useEffect(() => {
    Sound.setCategory('Playback')
  }, [])

  /**
   * 
   * @param {*} soundFile : require('../assets/sounds/bell_10.mp3')
   * @param {*} volume : 0 -> 1
   * @param {*} interrupt : true = stop exist sound before play new sound
   */
  const play = (soundFile, volume = 1, numberOfLoops = 0, interrupt = true) => {
    // Release playback instance if exists
    if (interrupt && playbackInstance) {
      release()
    }

    const whoosh = new Sound(soundFile, (error) => {
      if (error) {
        logger('failed to load the sound', error)
        return
      }

      // loaded successfully
      logger('loaded successfully, duration in seconds', whoosh.getDuration())
      whoosh.setVolume(volume)
      whoosh.setNumberOfLoops(numberOfLoops)
      setPlaybackInstance(whoosh)

      // Play the sound with an onEnd callback
      whoosh.play((success) => {
        if (success) {
          logger('successfully finished playing')
        } else {
          logger('playback failed due to audio decoding errors')
        }

        if (interrupt) {
          whoosh.release()
          setPlaybackInstance(null)
        }
      })
    })
  }

  const release = () => {
    if (playbackInstance) {
      playbackInstance.release()
      setPlaybackInstance(null)
    }
  }

  return { play, release }
}

export default useSound
