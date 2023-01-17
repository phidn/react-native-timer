import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Text, Button, Modal, Portal, RadioButton, useTheme } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import useSound from '@/hooks/useSound'
import { useStore } from '@/store/useStore'

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

  return isShow? (
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
            <RadioButton.Item
              key="bell_default"
              label={t('Prepare.defaultBell')}
              value="bell_default"
            />
            {[1, 2, 3].map((x) => (
              <RadioButton.Item
                key={`bell_${x}`}
                label={`${t('Prepare.bell')} ${x}`}
                value={`bell_${x}`}
              />
            ))}
            {[4, 5, 6, 7, 8, 9].map((x) => (
              <RadioButton.Item
                key={`bell_${x}`}
                label={`${t('Prepare.bell')} ${x}`}
                value={`bell_${x}`}
                disabled={true}
              />
            ))}
          </RadioButton.Group>
        </ScrollView>
        <View style={styles.modalActions}>
          <Button onPress={onConfirm}>Ok</Button>
        </View>
      </Modal>
    </Portal>
  ): null
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
