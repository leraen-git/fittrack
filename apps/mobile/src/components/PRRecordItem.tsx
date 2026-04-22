import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface PRRecordItemProps {
  exerciseName: string
  weight: number
  reps: number
  achievedAt: string
  onPress?: () => void
}

export const PRRecordItem = React.memo(function PRRecordItem({ exerciseName, weight, reps, achievedAt, onPress }: PRRecordItemProps) {
  const { tokens, fonts } = useTheme()

  const date = new Date(achievedAt)
  const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
      }}
      accessibilityLabel={`${exerciseName} ${weight} kg`}
      accessibilityRole={onPress ? 'button' : 'text'}
    >
      <View style={{
        width: 28,
        height: 28,
        borderWidth: 1,
        borderColor: tokens.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
      }}>
        <Text style={{ fontFamily: fonts.sansB, fontSize: 10, color: tokens.accent }}>PR</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: fonts.sansB,
          fontSize: 13,
          color: tokens.text,
          textTransform: 'uppercase',
        }}>
          {exerciseName}
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: tokens.textMute }}>
          {dateStr}
        </Text>
      </View>
      <Text style={{ fontFamily: fonts.sansX, fontSize: 16, color: tokens.accent }}>
        {weight} kg
      </Text>
    </TouchableOpacity>
  )
})
