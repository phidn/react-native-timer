import React from 'react'
import { TouchableOpacity, useWindowDimensions } from 'react-native'
import { Avatar, useTheme } from 'react-native-paper'
import { useStore } from '@/store/useStore'
import Color from 'color'
import { getThemeColors } from '@/utilities/themeHelper'

const ListColor = ({ gap, range, togglePicker }) => {
  const { colors } = useTheme()
  const amount = range[1] - range[0]

  const isDarkMode = useStore((state) => state.isDarkMode)
  const themeColor = useStore((state) => state.themeColor)
  const customColor = useStore((state) => state.customColor)
  const setThemeColor = useStore((state) => state.setThemeColor)
  const setCustomColor = useStore((state) => state.setCustomColor)

  const { width: windowWidth } = useWindowDimensions()
  const size = (windowWidth - 10 * (amount - 1) - gap) / amount
  const _size = size < 30 ? size : 30

  const newRange = [range[0], range[1] - 1]

  const changeThemeColor = (colorSource) => {
    setThemeColor(colorSource)
    setCustomColor('')
  }

  return (
    <>
      <TouchableOpacity onPress={() => togglePicker()}>
        <Avatar.Icon
          size={_size}
          style={{ marginHorizontal: 5, backgroundColor: customColor || colors.surface }}
          icon="plus"
        />
      </TouchableOpacity>

      {getThemeColors().slice(newRange[0], newRange[1]).map((color) => {
        const alpha = color.source === themeColor ? 1 : 0
        const { primary, onPrimary } = isDarkMode ? color.dark.colors : color.light.colors
        const onPrimaryAlpha = Color(onPrimary).alpha(alpha).toString()

        return (
          <TouchableOpacity key={color.source} onPress={() => changeThemeColor(color.source)}>
            <Avatar.Icon
              size={_size}
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
