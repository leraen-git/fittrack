import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface RadioItemProps {
  label: string
  description?: string
  selected: boolean
  onPress: () => void
}

export function RadioItem({
  label,
  description,
  selected,
  onPress,
}: RadioItemProps) {
  const { tokens, fonts } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{
          fontFamily: fonts.sansB,
          fontSize: 14,
          color: selected ? tokens.accent : tokens.text,
        }}>
          {label}
        </Text>
        {description && (
          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            color: tokens.textMute,
          }}>
            {description}
          </Text>
        )}
      </View>

      <View style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: selected ? tokens.accent : tokens.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {selected && (
          <View style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: tokens.accent,
          }} />
        )}
      </View>
    </TouchableOpacity>
  )
}
