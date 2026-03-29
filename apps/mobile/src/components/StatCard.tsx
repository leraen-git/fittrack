import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  accessibilityLabel?: string
}

export function StatCard({ label, value, trend, accessibilityLabel }: StatCardProps) {
  const { colors, typography, spacing } = useTheme()

  const trendColor =
    trend === 'up' ? colors.success : trend === 'down' ? colors.danger : colors.textMuted

  return (
    <Card accessibilityLabel={accessibilityLabel ?? `${label}: ${value}`} style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: typography.family.regular,
          fontSize: typography.size.sm,
          color: colors.textMuted,
          marginBottom: spacing.xs,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: typography.family.extraBold,
          fontSize: typography.size['2xl'],
          color: trend ? trendColor : colors.textPrimary,
        }}
      >
        {value}
      </Text>
    </Card>
  )
}
