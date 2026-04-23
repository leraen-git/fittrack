import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface QuickSetButtonProps {
  label: string
  onPress: () => void
}

export function QuickSetButton({ label, onPress }: QuickSetButtonProps) {
  const { tokens, fonts } = useTheme()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: tokens.borderStrong,
      }}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={{
        fontFamily: fonts.sansB,
        fontSize: 13,
        color: tokens.text,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}
