# Mindfulness Meditation Tracker

## Release
- yarn release
- https://console.firebase.google.com/u/0/project/test-apk-7ffe1/testlab/run/robo

## Release hacks
- npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

- apk release
  + cd android && gradlew clean && gradlew assembleRelease
  + adb install app/build/outputs/apk/release/app-release.apk

- apk debug: 
  + cd android && gradlew clean && gradlew assembleDebug
  + adb install android/app/build/outputs/apk/debug/app-debug.apk

- aab: cd android && gradlew clean && gradlew bundleRelease


### Fix hermes
```
<!-- app/build.gradle -->

project.ext.react = [
    enableHermes: true,  // clean and rebuild if changing
]

project.ext.react = [
    enableHermes: false,
    deleteDebugFilesForVariant: { false }
]
```

### Version
- https://www.npmjs.com/package/react-native-version
- npm install -g react-native-version
- react-native-version --never-amend
### Icon
- https://www.appicon.co/

## Bugs
1. Fix "Android Gradle plugin requires Java 11 to run. You are currently using Java 1.8"
```
org.gradle.java.home=C:\\Program Files\\Java\\jdk-11.0.17
```

## Patch react-native-paper
`node_modules/react-native-paper/src/components/BottomNavigation/BottomNavigation.tsx#L1181`

```css
v3IconContainer: {
  height: 32,
  width: 32,
  marginBottom: 0,
  marginTop: 0,
  justifyContent: 'center',
},

v3NoLabelContainer: {
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
},
```

## Icons
- https://materialdesignicons.com/
- https://oblador.github.io/react-native-vector-icons/

## Privacy Policy Generator
- https://app-privacy-policy-generator.nisrulz.com/

## References
- https://github.com/pmndrs/zustand
- https://github.com/girish54321/react-native-starter
- https://github.dev/victorkvarghese/react-native-query-boilerplate
- https://github.dev/phidnhh/meditation-track

- https://github.com/remigallego/react-native-sound
- https://github.com/remigallego/react-native-use-sound

- https://youmightnotneed.com/lodash
- https://buildicon.netlify.app/?color=2196f3&emoji=dog

- https://github.com/remigallego/react-native-use-sound

- https://cdn.jsdelivr.net/npm/dayjs@1/locale.json
- In app purchase: https://www.youtube.com/watch?v=bKhTCX3l24o
- ADS: https://docs.page/invertase/react-native-google-mobile-ads/displaying-ads#banner-ads-component

- API Access: https://www.youtube.com/watch?v=Ls2wkAwXftk
- http://developer.android.com/tools/help/emulator.html#controlling

## Repo
- https://github.com/AudiusProject/audius-client
- https://github.com/zensayyy/ZenMusic
- https://github.com/Vetrivel-VP/react-native-musicplayer
- https://github.com/dr0id007/forest-native
- https://www.npmjs.com/package/react-native-bundle-visualizer
- https://github.com/juanamd/react-native-background-timer-android
