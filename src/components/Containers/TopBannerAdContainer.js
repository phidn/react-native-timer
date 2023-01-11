import React, { useEffect, useState } from 'react'
import { View, ScrollView, useWindowDimensions } from 'react-native'
import { useTheme } from 'react-native-paper'
import { roundNumber } from '@/utilities/commonHelper'

import { admobBannerId } from '@/config/config'
import { BannerAd, TestIds } from 'react-native-google-mobile-ads'
import useStatsSessions from '@/hooks/useStatsSessions'
import { useStore } from '@/store/useStore'
import Purchases from 'react-native-purchases'
import { logger } from '@/utilities/logger'
const adUnitId = __DEV__ ? TestIds.BANNER : admobBannerId

const TopBannerAdContainer = ({ style, children }) => {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const _width = roundNumber(width)

  const isPremium = useStore((state) => state.isPremium)
  const setIsPremium = useStore((state) => state.setIsPremium)

  const { longestStreak } = useStatsSessions()

  const [isShowBanner, setIsShowBanner] = useState(false)

  useEffect(() => {
    const checkShowBanner = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo()
        if (customerInfo?.allPurchasedProductIdentifiers?.length > 0) {
          setIsPremium(true)
          return false
        } else {
          setIsPremium(false)
        }
      } catch (error) {
        logger('→ error:', error)
      }

      if (longestStreak < 4) return false

      return true
    }

    const prepareShowBanner = async () => {
      const _isShowBanner = await checkShowBanner()
      setIsShowBanner(_isShowBanner)
    }

    prepareShowBanner()
  }, [longestStreak, isPremium])

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}>
      {isShowBanner && (
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
