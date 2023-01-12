import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native'
import PageContainer from '@/components/Containers/PageContainer'
import Purchases from 'react-native-purchases'
import { logger } from '@/utilities/logger'
import { Banner, Button, List, useTheme, SegmentedButtons } from 'react-native-paper'
import premiumImage from '@/assets/images/premium.png'
import plantImage from '@/assets/images/plant.png'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useTranslation } from 'react-i18next'
import { capitalize } from '@/utilities/commonHelper'
import { useStore } from '@/store/useStore'

const GoPremiumScreen = ({ navigation }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  
  const setIsPremium = useStore(state => state.setIsPremium)

  const [packages, setPackages] = useState([])
  const [donations, setDonations] = useState([])
  const [donationValue, setDonationValue] = useState('')

  useEffect(() => {
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings()
        if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
          const _packages = offerings.current.availablePackages
          setPackages(_packages)

          const _donations = _packages.map((packageItem) => {
            const identifier = packageItem.product.identifier
            const title = packageItem.product.title.replace(' (Mindfulness: Daily Check-in)', '')

            return { label: title, value: identifier }
          })
          setDonations(_donations)
          setDonationValue(_donations[1].value)
        }
      } catch (error) {
        logger('error getting offers', error.message)
      }
    }
    getPackages()
  }, [])

  const buyPackage = async (pack) => {
    try {
      await Purchases.purchasePackage(pack)
      setIsPremium(true)
      navigation.goBack()
      
    } catch (error) {
      if (!error.userCancelled) {
        logger('→ buyPackage error', error)
      } else {
        logger('→ error.userCancelled')
      }
    }
  }

  const renderDonationButton = () => {
    if (!donationValue) return null

    const selectedDonation = donations.find((x) => x.value === donationValue)
    let icon = 'account-arrow-up-outline'

    if (selectedDonation.value === 'mc_coffee') {
      icon = 'coffee'
    }
    if (selectedDonation.value === 'mc_tea') {
      icon = 'tea'
    }
    if (selectedDonation.value === 'mc_lunch') {
      icon = 'hamburger'
    }

    const selectedPackage = packages.find((x) => x.product.identifier === donationValue)

    return (
      <Button
        icon={icon}
        mode="contained-tonal"
        onPress={() => buyPackage(selectedPackage)}
        style={{ marginTop: 10 }}
      >
        {selectedPackage.product.priceString}
      </Button>
    )
  }

  return (
    <PageContainer isScroll={true}>
      <Banner
        visible={true}
        icon={({ size }) => <Image source={premiumImage} style={{ width: size, height: size }} />}
      >
        {t('GoPremium.banner')}
      </Banner>

      <View style={styles.content}>
        <List.Item
          title={t('GoPremium.noMoreAds') + '!'}
          titleNumberOfLines={3}
          left={(props) => (
            <MaterialIcons {...props} name="check-circle" size={24} color={colors.primary} />
          )}
        />
        <List.Item
          title={t('GoPremium.moreSounds')}
          titleNumberOfLines={3}
          left={(props) => (
            <MaterialIcons {...props} name="check-circle" size={24} color={colors.primary} />
          )}
          style={{ marginTop: -10 }}
        />
        <List.Item
          title={t('GoPremium.advancedStats')}
          titleNumberOfLines={3}
          left={(props) => (
            <MaterialIcons {...props} name="check-circle" size={24} color={colors.primary} />
          )}
          style={{ marginTop: -10 }}
        />
        <List.Item
          title={t('GoPremium.customStyling')}
          titleNumberOfLines={4}
          left={(props) => (
            <MaterialIcons {...props} name="check-circle" size={24} color={colors.primary} />
          )}
          style={{ marginTop: -10 }}
        />
        <List.Item
          title={t('GoPremium.developmentSupport')}
          titleNumberOfLines={4}
          left={(props) => (
            <MaterialIcons {...props} name="check-circle" size={24} color={colors.primary} />
          )}
          style={{ marginTop: -10 }}
        />

        <View style={{ marginTop: 30 }}>
          {donationValue && (
            <SegmentedButtons
              value={donationValue}
              onValueChange={setDonationValue}
              buttons={donations}
            />
          )}
        </View>
        {renderDonationButton()}
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  buyButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 20,
  },
})

export default GoPremiumScreen
