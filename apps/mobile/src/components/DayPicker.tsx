import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'

// 0=Sun 1=Mon … 6=Sat — ordered Mon–Sun for display
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_LABELS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const DAY_LABELS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

interface Props {
  value: number[]  // selected day indices (0=Sun … 6=Sat)
  onChange: (days: number[]) => void
  lang?: 'en' | 'fr'
}

export function DayPicker({ value, onChange, lang = 'en' }: Props) {
  const { colors, typography, spacing, radius } = useTheme()
  const labels = lang === 'fr' ? DAY_LABELS_FR : DAY_LABELS_EN

  const toggle = (day: number) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day))
    } else {
      onChange([...value, day])
    }
  }

  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
      {DAY_ORDER.map((day, i) => {
        const selected = value.includes(day)
        return (
          <TouchableOpacity
            key={day}
            onPress={() => toggle(day)}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: radius.pill,
              backgroundColor: selected ? colors.primary : colors.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={`Day ${labels[i]}`}
          >
            <Text style={{
              fontFamily: typography.family.bold,
              fontSize: typography.size.xs,
              color: selected ? tokenColors.white : colors.textMuted,
            }}>
              {labels[i]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
