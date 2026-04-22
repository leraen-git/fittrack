import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface ViewToggleProps {
  value: 'list' | 'stats'
  onChange: (value: 'list' | 'stats') => void
  labels: [string, string]
}

export const ViewToggle = React.memo(function ViewToggle({ value, onChange, labels }: ViewToggleProps) {
  const { tokens, fonts } = useTheme()

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: tokens.surface2,
      padding: 3,
    }}>
      {(['list', 'stats'] as const).map((mode, i) => {
        const active = value === mode
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => onChange(mode)}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: active ? tokens.bg : 'transparent',
              borderWidth: active ? 1 : 0,
              borderColor: tokens.border,
            }}
            accessibilityLabel={labels[i]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={{
              fontFamily: active ? fonts.sansB : fonts.sansM,
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: 'uppercase',
              color: active ? tokens.text : tokens.textMute,
            }}>
              {labels[i]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
})
