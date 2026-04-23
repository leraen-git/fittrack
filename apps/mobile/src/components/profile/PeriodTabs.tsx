import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import type { WeightPeriod } from '@tanren/shared'

const PERIODS: WeightPeriod[] = ['7d', '30d', '3m', '1y']
const LABEL_KEYS: Record<WeightPeriod, string> = {
  '7d': 'profile.weightPeriod7d',
  '30d': 'profile.weightPeriod30d',
  '3m': 'profile.weightPeriod3m',
  '1y': 'profile.weightPeriod1y',
}

interface PeriodTabsProps {
  value: WeightPeriod
  onChange: (period: WeightPeriod) => void
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={{
      flexDirection: 'row',
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: tokens.border,
    }}>
      {PERIODS.map((p, i) => {
        const active = p === value
        return (
          <TouchableOpacity
            key={p}
            onPress={() => onChange(p)}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              backgroundColor: active ? tokens.accent : 'transparent',
              borderLeftWidth: i > 0 ? 1 : 0,
              borderLeftColor: tokens.border,
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={{
              fontFamily: fonts.sansB,
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              color: active ? '#FFFFFF' : tokens.textMute,
            }}>
              {t(LABEL_KEYS[p])}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
