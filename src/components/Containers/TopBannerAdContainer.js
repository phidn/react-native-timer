import React from 'react'
import { View, ScrollView, useWindowDimensions } from 'react-native'
import { useTheme } from 'react-native-paper'
import { roundNumber } from '@/utilities/commonHelper'

import { admobBannerId } from '@/config/config'
import { BannerAd, TestIds } from 'react-native-google-mobile-ads'
import useStatsSessions from '@/hooks/useStatsSessions'
import { useStore } from '@/store/useStore'
const adUnitId = __DEV__ ? TestIds.BANNER : admobBannerId

const TopBannerAdContainer = ({ style, children }) => {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const _width = roundNumber(width)

  const isPremium = useStore((state) => state.isPremium)
  const { longestStreak } = useStatsSessions()

  const checkShowBanner = () => {
    if (isPremium) return false
    if (longestStreak < 7) return false

    return true
  }

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      {checkShowBanner() && (
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
