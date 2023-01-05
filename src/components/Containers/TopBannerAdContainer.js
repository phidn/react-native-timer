import React from 'react'
import { View, ScrollView, useWindowDimensions } from 'react-native'
import { useTheme } from 'react-native-paper'
import { roundNumber } from '@/utilities/commonHelper'

import { admobBannerId } from '@/config/config'
import { BannerAd, TestIds } from 'react-native-google-mobile-ads'
import useStatsSessions from '@/hooks/useStatsSessions'
const adUnitId = __DEV__ ? TestIds.BANNER : admobBannerId

const TopBannerAdContainer = ({ style, children }) => {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const _width = roundNumber(width)

  const { longestStreak } = useStatsSessions()
  const showBanner = longestStreak > 2

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      {showBanner && (
        <BannerAd
          unitId={adUnitId}
          size={`${_width}x50`}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      )}
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </ScrollView>
  )
}

export default TopBannerAdContainer
