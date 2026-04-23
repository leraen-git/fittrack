import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'

interface WeightChartStatsProps {
  min: number | null
  avg: number | null
  max: number | null
}

function formatKg(v: number | null): string {
  if (v == null) return '—'
  return v.toFixed(1).replace('.', ',')
}

export function WeightChartStats({ min, avg, max }: WeightChartStatsProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  const cells = [
    { label: t('profile.weightStatsMin'), value: min, color: tokens.green },
    { label: t('profile.weightStatsAvg'), value: avg, color: tokens.text },
    { label: t('profile.weightStatsMax'), value: max, color: tokens.amber },
  ]

  return (
    <View style={{
      flexDirection: 'row',
      marginHorizontal: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: tokens.border,
    }}>
      {cells.map((cell, i) => (
        <View key={cell.label} style={{
          flex: 1,
          paddingVertical: 10,
          alignItems: 'center',
          borderLeftWidth: i > 0 ? 1 : 0,
          borderLeftColor: tokens.border,
        }}>
          <Text style={{
            fontFamily: fonts.monoB,
            fontSize: 14,
            color: cell.color,
          }}>
            {formatKg(cell.value)}
          </Text>
          <Text style={{
            fontFamily: fonts.sansB,
            fontSize: 8,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: tokens.textMute,
            marginTop: 2,
          }}>
            {cell.label}
          </Text>
        </View>
      ))}
    </View>
  )
}
