import React from 'react'
import { ScrollView, TouchableOpacity, Text, View } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'

interface PillFilterProps {
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

export function PillFilter({ options, selected, onSelect }: PillFilterProps) {
  const { colors, typography, spacing, radius } = useTheme()

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {options.map((option) => {
          const isSelected = option === selected
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              style={{
                paddingVertical: spacing.xs,
                paddingHorizontal: spacing.md,
                borderRadius: radius.pill,
                backgroundColor: isSelected ? colors.primary : colors.surface2,
              }}
              accessibilityLabel={`Filter by ${option}`}
              accessibilityRole="button"
            >
              <Text
                style={{
                  fontFamily: isSelected ? typography.family.semiBold : typography.family.regular,
                  fontSize: typography.size.base,
                  color: isSelected ? tokenColors.white : colors.textMuted,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  )
}
