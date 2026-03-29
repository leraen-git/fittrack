import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface SetRowProps {
  setNumber: number
  reps: number
  weight: number
  isCompleted: boolean
  previousReps?: number
  previousWeight?: number
  onRepsChange: (v: number) => void
  onWeightChange: (v: number) => void
  onComplete: () => void
}

export function SetRow({
  setNumber,
  reps,
  weight,
  isCompleted,
  previousReps,
  previousWeight,
  onRepsChange,
  onWeightChange,
  onComplete,
}: SetRowProps) {
  const { colors, typography, spacing, radius } = useTheme()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: isCompleted ? colors.surface2 : colors.surface,
        borderRadius: radius.md,
        padding: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: isCompleted ? colors.success : colors.surface2,
      }}
    >
      {/* Set number */}
      <Text
        style={{
          fontFamily: typography.family.bold,
          fontSize: typography.size.base,
          color: colors.textMuted,
          width: 24,
        }}
      >
        {setNumber}
      </Text>

      {/* Previous ghost values */}
      <Text
        style={{
          fontFamily: typography.family.regular,
          fontSize: typography.size.xs,
          color: colors.textMuted,
          width: 60,
          textAlign: 'center',
        }}
      >
        {previousReps != null && previousWeight != null
          ? `${previousReps}×${previousWeight}kg`
          : '—'}
      </Text>

      {/* Reps input */}
      <TextInput
        value={reps > 0 ? String(reps) : ''}
        onChangeText={(v) => onRepsChange(parseInt(v) || 0)}
        keyboardType="numeric"
        placeholder="Reps"
        placeholderTextColor={colors.textMuted}
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontFamily: typography.family.semiBold,
          fontSize: typography.size.body,
          backgroundColor: colors.background,
          borderRadius: radius.sm,
          padding: spacing.xs,
          textAlign: 'center',
        }}
        accessibilityLabel={`Set ${setNumber} reps`}
        accessibilityRole="none"
        editable={!isCompleted}
      />

      {/* Weight input */}
      <TextInput
        value={weight > 0 ? String(weight) : ''}
        onChangeText={(v) => onWeightChange(parseFloat(v) || 0)}
        keyboardType="decimal-pad"
        placeholder="kg"
        placeholderTextColor={colors.textMuted}
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontFamily: typography.family.semiBold,
          fontSize: typography.size.body,
          backgroundColor: colors.background,
          borderRadius: radius.sm,
          padding: spacing.xs,
          textAlign: 'center',
        }}
        accessibilityLabel={`Set ${setNumber} weight`}
        accessibilityRole="none"
        editable={!isCompleted}
      />

      {/* Complete button */}
      <TouchableOpacity
        onPress={onComplete}
        disabled={isCompleted}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: isCompleted ? colors.success : colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel={isCompleted ? 'Set completed' : `Complete set ${setNumber}`}
        accessibilityRole="button"
      >
        <Text style={{ color: isCompleted ? '#fff' : colors.textMuted, fontSize: 16 }}>
          {isCompleted ? '✓' : '○'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
