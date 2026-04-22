import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { formatVolume, formatWeight } from '@/utils/format'
import type { SessionExerciseDetail } from '@tanren/shared'

interface ExerciseBlockProps {
  exercise: SessionExerciseDetail
  index: number
}

export const ExerciseBlock = React.memo(function ExerciseBlock({ exercise, index }: ExerciseBlockProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  const headers = [
    t('history.detailSetIdx'),
    t('history.detailSetReps'),
    t('history.detailSetLoad'),
    t('history.detailSetRest'),
  ]

  return (
    <View style={{ gap: 0 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fonts.sansX, fontSize: 14, color: tokens.accent }}>
            {index + 1}.
          </Text>
          <Text style={{ fontFamily: fonts.sansB, fontSize: 14, color: tokens.text, textTransform: 'uppercase' }}>
            {exercise.exerciseName}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.monoB, fontSize: 12, color: tokens.textMute }}>
          {formatVolume(exercise.volume)}
        </Text>
      </View>

      {/* Table header */}
      <View style={{ flexDirection: 'row', backgroundColor: tokens.surface2, paddingVertical: 4, paddingHorizontal: 8 }}>
        {headers.map((h, i) => (
          <Text
            key={h}
            style={{
              flex: i === 0 ? 0.5 : 1,
              fontFamily: fonts.sansB,
              fontSize: 9,
              letterSpacing: 1.2,
              color: tokens.textMute,
              textTransform: 'uppercase',
              textAlign: i === 0 ? 'left' : 'center',
            }}
          >
            {h}
          </Text>
        ))}
      </View>

      {/* Rows */}
      {exercise.sets.map((s) => (
        <View
          key={s.id}
          style={{
            flexDirection: 'row',
            paddingVertical: 6,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: tokens.border,
          }}
        >
          <Text style={{ flex: 0.5, fontFamily: fonts.monoB, fontSize: 12, color: tokens.textMute }}>
            {s.setNumber}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontFamily: fonts.monoB, fontSize: 12, color: s.isPR ? tokens.accent : tokens.text }}>
              {s.reps}
            </Text>
            {s.isPR && (
              <Text style={{ fontFamily: fonts.sansB, fontSize: 8, color: tokens.accent, letterSpacing: 0.5 }}>
                {t('history.detailPRMark')}
              </Text>
            )}
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.monoB, fontSize: 12, color: s.isPR ? tokens.accent : tokens.text, textAlign: 'center' }}>
            {formatWeight(s.weight)}
          </Text>
          <Text style={{ flex: 1, fontFamily: fonts.mono, fontSize: 12, color: tokens.textMute, textAlign: 'center' }}>
            {s.restSeconds != null ? `${s.restSeconds}s` : '--'}
          </Text>
        </View>
      ))}
    </View>
  )
})
