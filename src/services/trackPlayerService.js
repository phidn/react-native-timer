import logger from '@utilities/logger'
import TrackPlayer, {
  Event,
  State,
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player'

export const trackPlayerService = async () => {
  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play())
  TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause())
  TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.reset())
}

export const setupTrackPlayerService = async () => {
  let isSetup = false
  try {
    await TrackPlayer.getCurrentTrack()
    isSetup = true
  } catch (error) {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      compactCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      progressUpdateEventInterval: 1,
    })

    isSetup = true
  } finally {
    return isSetup
  }
}
