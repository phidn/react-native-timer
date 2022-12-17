import React from 'react'
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'
import Svg, { Path } from 'react-native-svg'
import { useHeaderHeight } from '@react-navigation/elements'
import Color from 'color'

const waveWidth = 1366
const waveHeight = 446
const aspectRatio = waveWidth / waveHeight

const WaveContainer = ({ padding, paddingHorizontal, style, isScroll, children }) => {
  const { primary, background } = useTheme().colors
  const navigationHeaderHeight = useHeaderHeight()

  const statusBarHeight = StatusBar.currentHeight
  const bodyTop = navigationHeaderHeight + statusBarHeight
  const waveScaleY = bodyTop > 123 ? (bodyTop + 20) / 123 : 1

  const color_1 = Color(primary).alpha(0.6).string()
  const color_2 = Color(primary).alpha(0.2).string()

  return (
    <View style={[styles.container, { backgroundColor: background }, style]}>
      <View style={[styles.wave, { aspectRatio, top: -10 }]}>
        <Svg
          style={styles.waveSvg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${waveWidth} ${waveHeight}`}
          scaleY={waveScaleY}
        >
          <Path
            d="M396.3,373.9c-6,0-12.1,.2-18.1,.2-.7,0-1.4,0-2.1,.2-.7,0-1.4,.2-2.1,.2-1.4-.6-2.8,0-4.3,0-9.5,.5-19.4,1.9-28.7,.2-18.6-3.5-37.3-7.4-56.1-10.7-24.6-4.4-49.5-7.4-74.3-9.8-19.4-1.9-39-3.2-58.5-3.5-19.9-.5-39.7-.5-59.6,.6-23.9,1.3-47.8,2.7-71.6,5.4-6.8,.8-13.8,1.1-20.5,3.3C.4,241.5,.4,123.4,.3,5c0-3.9,.4-5,4.3-5C457.1,.2,909.5,.2,1362,0c3.8,0,4.3,1.1,4.3,4.9-.1,120.2-.1,240.4-.1,360.6-15.1-.8-29.9-4.3-44.7-6.5-36.3-5.4-72.7-7.4-109.1-8.7-18.1-.6-36.1-.6-54.4,.8-17.6,1.4-35.3,1.9-53.1,3.5-27.3,2.7-54.5,6.6-81.5,12.2-25.8,5.4-51.4,11.4-76.3,20.9-24.3,9.2-48.9,17.2-74.1,22.9-4.3,.9-8.8,1.1-12.7,3.5-1.8,0-3.6,0-5.4,.2-1.6-1.9-4-1.6-6-2.2-10.5-2.8-21.1-5.4-31.4-8.4-22.9-6.8-46-12.8-69.3-17.9-26.9-5.8-53.9-10.9-81.1-14.5-21.2-2.8-42.5-5.4-63.9-6.8-11.1-.6-22.3-.5-33.4-1.6-20.1-1.7-40.1-1.3-60.2-.6-26.3,.8-52.6,2.7-79,5.8-11.4,1.7-22.8,3.9-34.3,5.8Z"
            fill={color_1}
          />
          <Path
            d="M860.4,414.2c4-2.4,8.4-2.5,12.7-3.5,25.2-5.7,49.8-13.9,74.1-22.9,24.9-9.3,50.5-15.5,76.3-20.9,27-5.5,54.1-9.5,81.5-12.2,17.6-1.7,35.4-2.2,53.1-3.5,18.1-1.4,36.3-1.4,54.4-.8,36.4,1.3,72.8,3.3,109.1,8.7,14.9,2.2,29.6,5.7,44.7,6.5v14.2c-16.5,2.4-33,4.6-49.4,7.4-16.5,3-33,6.3-49.4,10.6-15.7,4.1-31.4,8.1-46.5,14.2-23.3,9.5-47.4,15.8-71.4,22.4-30,8.2-60.5,11.2-91.2,9.2-17.5-1.1-35-1.1-52.4-3.5-17.2-2.2-34.4-3.9-51.5-6.6-19.8-3.2-39.4-6.3-59-10.6-10.1-2.2-20.1-4.6-30.2-6.5-1.8-.3-3.6-.6-4.9-2.2Z"
            fill={color_2}
          />
          <Path
            d="M.3,359.7c6.7-2.2,13.7-2.5,20.5-3.3,23.8-2.7,47.7-4.1,71.6-5.4,19.9-.9,39.8-.9,59.6-.6,19.5,.3,39,1.6,58.5,3.5,24.9,2.5,49.7,5.4,74.3,9.8,18.6,3.3,37.3,7.3,56.1,10.7,9.4,1.7,19.2,.2,28.7-.2,1.4,0,2.8-.6,4.3,0-2.6,1.6-5.4,1.7-8.3,1.9-15.2,.3-30.6-.8-45.8,1.3-16.4,2.2-32.7,3.6-48.9,6.3-10,1.7-20.1,2.8-29.9,4.7-11.5,2.4-23.2,4.9-34.9,7.7-25.2,6.3-49.8,15-74.4,23.9s-49.9,14.5-75.3,19.9c-15.1,3.2-30.4,4.6-45.7,7-3.7,.6-6.7-3.5-10.7-2.2,.3-28.3,.3-56.6,.3-85Z"
            fill={color_2}
          />
          <Path
            d="M396.3,373.9c11.5-1.9,23-4.1,34.6-5.5,26.2-3.2,52.6-4.9,79-5.8,20.1-.6,40.1-1.3,60.2,.6,11.1,.9,22.3,.8,33.4,1.6,21.3,1.4,42.5,3.9,63.9,6.8,27.3,3.6,54.2,8.5,81.1,14.5,23.2,5.1,46.4,11.1,69.3,17.9,10.4,3,21.1,5.5,31.4,8.4,2,.6,4.3,.3,6,2.2-8.4,3.9-17.5,3.8-26.3,5.7-19.5,3.9-39.1,5.8-58.8,8.2-10.2,1.3-20.5,2.5-30.7,2.2-7.3-.3-14.5-3.2-21.6-5.1-22.6-6.2-45.2-12.5-68-18.8-27.2-7.4-54.5-13.3-82.1-18.2-21.9-3.9-44-7-66.2-9-14.8-1.4-29.6-2.8-44.4-3.6-20.6-1-40.6-2.1-60.8-2.1Z"
            fill={color_2}
          />
          <Path d="M375.9,374.2c.7,0,1.4,0,2.1-.2-.7,1.2-1.4,1.2-2.1,.2Z" fill={color_2} />
        </Svg>
      </View>
      {isScroll && (
        <ScrollView style={[styles.body, { marginTop: bodyTop, padding, paddingHorizontal }]}>
          {children}
        </ScrollView>
      )}
      {!isScroll && (
        <View style={[styles.body, { marginTop: bodyTop, padding, paddingHorizontal }]}>
          {children}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wave: {
    position: 'absolute',
    width: '100%',
  },
  body: {
    flex: 1,
  },
})

export default WaveContainer
