import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import App from './src/App'

import TrackPlayer from 'react-native-track-player'
import { trackPlayerService } from './src/services/trackPlayerService'

AppRegistry.registerComponent(appName, () => App)
TrackPlayer.registerPlaybackService(() => trackPlayerService)
