import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { formatVolume, formatDuration, formatDateShort } from '@/utils/format'
import { translateMuscleGroup } from '@/hooks/useExercises'
import type { SessionListItem } from '@tanren/shared'

interface SessionCardProps {
  session: SessionListItem
  onPress: () => void
}

export const SessionCard = React.memo(function SessionCard({ session, onPress }: SessionCardProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()
  const hasPR = session.prCount > 0

  const date = new Date(session.startedAt)
  const dateStr = formatDateShort(date)

  const isCompleted = !!session.completedAt

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: tokens.border,
        borderLeftWidth: hasPR ? 3 : 1,
        borderLeftColor: hasPR ? tokens.accent : tokens.border,
        padding: 14,
        paddingLeft: hasPR ? 13 : 14,
      }}
      accessibilityLabel={session.workoutName}
      accessibilityRole="button"
    >
      {hasPR && (
        <View style={{
          position: 'absolute',
          top: 12,
          right: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          borderWidth: 1,
          borderColor: tokens.accent,
          paddingHorizontal: 6,
          paddingVertical: 2,
        }}>
          <Text style={{ fontFamily: fonts.sansB, fontSize: 9, letterSpacing: 1, color: tokens.accent, textTransform: 'uppercase' }}>
            {session.prCount} PR
          </Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <Text style={{ fontFamily: fonts.sansX, fontSize: 15, letterSpacing: 0.3, color: tokens.text, textTransform: 'uppercase' }}>
          {session.workoutName || t('history.defaultWorkout')}
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.sansM, fontSize: 10, letterSpacing: 1, color: tokens.textMute, textTransform: 'uppercase', marginBottom: 6 }}>
        {dateStr}
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
        {session.durationSeconds != null && session.durationSeconds > 0 && (
          <Text style={{ fontFamily: fonts.sansB, fontSize: 12, color: tokens.textDim }}>
            {formatDuration(session.durationSeconds)}
          </Text>
        )}
        {(session.totalVolume ?? 0) > 0 && (
          <Text style={{ fontFamily: fonts.sansB, fontSize: 12, color: tokens.textDim }}>
            {formatVolume(session.totalVolume!)}
          </Text>
        )}
        {session.seriesCount > 0 && (
          <Text style={{ fontFamily: fonts.sans, fontSize: 10, color: tokens.textMute, alignSelf: 'center' }}>
            {session.seriesCount} {t('history.seriesLabel')}
          </Text>
        )}
      </View>

      {session.muscleGroups.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
          {session.muscleGroups.slice(0, 4).map((mg) => (
            <View key={mg} style={{ backgroundColor: tokens.surface2, paddingHorizontal: 7, paddingVertical: 3 }}>
              <Text style={{ fontFamily: fonts.sansB, fontSize: 8, letterSpacing: 1.2, color: tokens.textDim, textTransform: 'uppercase' }}>
                {translateMuscleGroup(mg, t)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {isCompleted && (
        <View style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <Text style={{ fontFamily: fonts.sansM, fontSize: 9, letterSpacing: 1, color: tokens.textMute, textTransform: 'uppercase' }}>
            {t('history.statusDone')}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
})
