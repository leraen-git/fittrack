import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useActiveSessionStore } from '@/stores/activeSessionStore'
import { calcSessionVolume } from '@fittrack/shared'

export default function RecapScreen() {
  const { colors, typography, spacing } = useTheme()
  const { sets, currentWorkout, finishSession } = useActiveSessionStore()

  const allSets = Array.from(sets.values()).flat()
  const totalVolume = calcSessionVolume([
    { sets: allSets.map((s) => ({ reps: s.reps ?? 0, weight: s.weight ?? 0, isCompleted: s.isCompleted ?? false })) },
  ])

  const handleSave = () => {
    finishSession()
    router.replace('/(tabs)/index' as any)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
          Session recap
        </Text>

        <Card accessibilityLabel="Total volume">
          <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted }}>Total volume</Text>
          <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['3xl'], color: colors.primary }}>
            {totalVolume.toLocaleString()} kg
          </Text>
        </Card>

        {currentWorkout && (
          <Card accessibilityLabel="Workout summary">
            <Text style={{ fontFamily: typography.family.semiBold, color: colors.textPrimary }}>
              {currentWorkout.name}
            </Text>
            <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted }}>
              {allSets.filter((s) => s.isCompleted).length} sets completed
            </Text>
          </Card>
        )}

        <Button label="Save & finish" onPress={handleSave} />
        <Button label="Keep training" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  )
}
