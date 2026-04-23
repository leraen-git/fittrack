import React from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import type { TrendDirection, WeightPeriod } from '@tanren/shared'

interface WeightHeroProps {
  currentKg: number | null
  measuredAt: string | null
  deltaKg: number | null
  trendDirection: TrendDirection | null
  period: WeightPeriod
}

const PERIOD_LABELS: Record<WeightPeriod, string> = {
  '7d': '7 jours',
  '30d': '30 jours',
  '3m': '3 mois',
  '1y': '1 an',
}

function formatRelativeDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (diffDays === 0) return `Aujourd'hui · ${time}`
  if (diffDays === 1) return `Hier · ${time}`
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · ${time}`
}

export function WeightHero({ currentKg, measuredAt, deltaKg, trendDirection, period }: WeightHeroProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  if (currentKg == null) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 32 }}>
        <Text style={{ fontFamily: fonts.monoB, fontSize: 56, color: tokens.textGhost }}>—</Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.textMute, marginTop: 8 }}>
          {t('profile.weightEmptyTitle')}
        </Text>
      </View>
    )
  }

  const deltaColor = trendDirection === 'DOWN' ? tokens.green
    : trendDirection === 'UP' ? tokens.amber
    : tokens.textMute

  const deltaSign = deltaKg != null && deltaKg > 0 ? '+' : ''
  const deltaText = deltaKg != null
    ? `${deltaSign}${deltaKg.toFixed(1).replace('.', ',')} kg sur ${PERIOD_LABELS[period]}`
    : null

  return (
    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ fontFamily: fonts.monoB, fontSize: 56, color: tokens.text }}>
          {currentKg.toFixed(1).replace('.', ',')}
        </Text>
        <Text style={{ fontFamily: fonts.sansM, fontSize: 18, color: tokens.textMute, marginLeft: 4 }}>
          kg
        </Text>
      </View>

      {measuredAt && (
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.textMute, marginTop: 4 }}>
          {formatRelativeDate(measuredAt)}
        </Text>
      )}

      {deltaText && (
        <Text style={{ fontFamily: fonts.sansB, fontSize: 13, color: deltaColor, marginTop: 8 }}>
          {deltaText}
        </Text>
      )}
    </View>
  )
}
