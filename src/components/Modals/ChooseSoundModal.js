import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Text, Button, Modal, Portal, RadioButton, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import useSound from '@/hooks/useSound'
import { useStore } from '@/store/useStore'
import { soundKeys } from '@/config/config'

const ChooseSoundModal = (props) => {
  const { isShow, toggleShow, soundVolume, initValue } = props
  const { colors } = useTheme()
  const { t } = useTranslation()

  const { playShortBell, release } = useSound()
  const [soundValue, setSoundValue] = useState(initValue)

  const setPrepare = useStore((state) => state.setPrepare)
  const setBellId = (bellId) => setPrepare({ bellId })

  const onSoundChange = (value) => {
    setSoundValue(value)
    playShortBell(value, soundVolume)
  }

  const onDismiss = () => {
    setSoundValue(initValue)
    toggleShow()
    release()
  }

  const onConfirm = () => {
    setBellId(soundValue)
    toggleShow()
    release()
  }

  return isShow ? (
    <Portal>
      <Modal
        visible={isShow}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: colors.elevation.level3,
          padding: 20,
          margin: 20,
          height: '80%',
        }}
      >
        <Text variant="headlineSmall">{t('Prepare.choose-a-bell')}</Text>
        <ScrollView style={[styles.modalScrollView, { borderColor: colors.outlineVariant }]}>
          <RadioButton.Group onValueChange={onSoundChange} value={soundValue}>
            {soundKeys.map((soundKey) => (
              <RadioButton.Item
                key={soundKey}
                label={soundKey.replace(/_/g, ' ')}
                value={soundKey}
              />
            ))}
          </RadioButton.Group>
        </ScrollView>
        <View style={styles.modalActions}>
          <Button onPress={onConfirm}>Ok</Button>
        </View>
      </Modal>
    </Portal>
  ) : null
}

export default ChooseSoundModal

const styles = StyleSheet.create({
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -10,
  },
  modalScrollView: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
})
