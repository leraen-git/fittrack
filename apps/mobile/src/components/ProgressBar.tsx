import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface ProgressBarProps {
  start: number
  current: number
  target: number
  label?: string
  unit?: string
}

export function ProgressBar({ start, current, target, label, unit = 'kg' }: ProgressBarProps) {
  const { colors, typography, spacing, radius } = useTheme()
  const progress = Math.min((current - start) / Math.max(target - start, 1), 1)

  return (
    <View>
      {label && (
        <Text
          style={{
            fontFamily: typography.family.semiBold,
            fontSize: typography.size.base,
            color: colors.textPrimary,
            marginBottom: spacing.xs,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          height: 8,
          backgroundColor: colors.surface2,
          borderRadius: radius.pill,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
            backgroundColor: colors.primary,
            borderRadius: radius.pill,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
        <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
          {start}{unit}
        </Text>
        <Text style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.xs, color: colors.primary }}>
          {current}{unit}
        </Text>
        <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
          {target}{unit}
        </Text>
      </View>
    </View>
  )
}
