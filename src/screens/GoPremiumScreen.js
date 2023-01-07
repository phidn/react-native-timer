import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PageContainer from '@/components/Containers/PageContainer'
import Purchases from 'react-native-purchases'
import { logger } from '@/utilities/logger'

const GoPremiumScreen = () => {
  useEffect(() => {
    const getEntitlements = async () => {
      try {
        const test = await Purchases.getOfferings()
        console.log('→ test:', test)
      } catch (error) {
        logger('→ error:', JSON.parse(JSON.stringify(error)))
      }
    }

    getEntitlements()
  }, [])

  return (
    <PageContainer style={{ padding: 20 }} isScroll={true}>
      <Text>GoPremiumScreen</Text>
    </PageContainer>
  )
}

const styles = StyleSheet.create({})

export default GoPremiumScreen
