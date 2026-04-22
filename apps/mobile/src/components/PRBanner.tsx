import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { formatWeight } from '@/utils/format'

interface PR {
  exerciseId: string
  exerciseName: string
  reps: number
  weight: number
}

interface PRBannerProps {
  prs: PR[]
}

export const PRBanner = React.memo(function PRBanner({ prs }: PRBannerProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  if (prs.length === 0) return null

  return (
    <View style={{
      backgroundColor: `${tokens.accent}14`,
      borderLeftWidth: 3,
      borderLeftColor: tokens.accent,
      padding: 12,
      gap: 6,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontFamily: fonts.jpX, fontSize: 22, color: tokens.accent }}>鍛</Text>
        <Text style={{
          fontFamily: fonts.sansB,
          fontSize: 13,
          letterSpacing: 1,
          color: tokens.accent,
          textTransform: 'uppercase',
        }}>
          {t('history.detailPRBanner', { count: prs.length })}
        </Text>
      </View>
      {prs.map((pr) => (
        <Text key={`${pr.exerciseId}-${pr.weight}-${pr.reps}`} style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.textMute }}>
          {pr.exerciseName} · {formatWeight(pr.weight)} x {pr.reps}
        </Text>
      ))}
    </View>
  )
})
