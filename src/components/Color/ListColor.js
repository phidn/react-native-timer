import React from 'react'
import { TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar } from 'react-native-paper'
import { themeMeditationColors } from '@config/theme'
import { useStore } from '@store/useStore'
import Color from 'color'

const ListColor = ({ amount = themeMeditationColors.length, gap }) => {
  const isDarkMode = useStore((state) => state.isDarkMode)
  const themeColor = useStore((state) => state.themeColor)
  const setThemeColor = useStore((state) => state.setThemeColor)

  const { width: windowWidth } = useWindowDimensions()
  const size = (windowWidth - 10 * (amount - 1) - gap) / amount

  return (
    <>
      {themeMeditationColors.slice(0, amount).map((color) => {
        const alpha = color.label === themeColor ? 1 : 0
        const { primary, onPrimary } = isDarkMode? color.value.dark.colors: color.value.light.colors
        const onPrimaryAlpha = Color(onPrimary).alpha(alpha).toString()

        return (
          <TouchableOpacity key={color.value.source} onPress={() => setThemeColor(color.label)}>
            <Avatar.Icon
              size={size}
              style={{ backgroundColor: primary, marginHorizontal: 5 }}
              icon="check"
              color={onPrimaryAlpha}
            />
          </TouchableOpacity>
        )
      })}
    </>
  )
}

export default ListColor
