import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { SkeletonCard } from '@/components/SkeletonCard'
import { useActiveSessionStore } from '@/stores/activeSessionStore'
import { trpc } from '@/lib/trpc'

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, typography, spacing } = useTheme()
  const { data: workout, isLoading } = trpc.workouts.byId.useQuery({ id })
  const startSession = useActiveSessionStore((s) => s.startSession)

  const handleStart = () => {
    if (!workout) return
    const sessionExercises = workout.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseId, // resolved by exercise lookup in a full impl
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      defaultWeight: ex.defaultWeight,
      defaultRestSeconds: ex.defaultRestSeconds,
    }))
    startSession(
      {
        id: workout.id,
        userId: workout.userId,
        name: workout.name,
        description: workout.description ?? null,
        muscleGroups: workout.muscleGroups,
        estimatedDuration: workout.estimatedDuration,
        isTemplate: workout.isTemplate,
        isProgramWorkout: workout.isProgramWorkout,
        order: workout.order,
        createdAt: new Date(workout.createdAt),
      },
      sessionExercises,
    )
    router.push('/workout/active')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Button label="← Back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />

        {isLoading && (
          <>
            <SkeletonCard height={40} />
            <SkeletonCard height={80} />
            <SkeletonCard height={80} />
          </>
        )}

        {workout && (
          <>
            <View>
              <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
                {workout.name}
              </Text>
              {workout.description && (
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.body, color: colors.textMuted, marginTop: spacing.xs }}>
                  {workout.description}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Card style={{ flex: 1 }} accessibilityLabel="Duration">
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>Duration</Text>
                <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>~{workout.estimatedDuration} min</Text>
              </Card>
              <Card style={{ flex: 1 }} accessibilityLabel="Exercises">
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>Exercises</Text>
                <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>{workout.exercises.length}</Text>
              </Card>
            </View>

            <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
              Exercises
            </Text>
            {workout.exercises.map((ex, i) => (
              <Card key={ex.id} accessibilityLabel={`Exercise ${i + 1}`}>
                <Text style={{ fontFamily: typography.family.semiBold, color: colors.textPrimary }}>
                  {i + 1}. Exercise
                </Text>
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
                  {ex.defaultSets} sets × {ex.defaultReps} reps @ {ex.defaultWeight}kg
                </Text>
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
                  Rest: {ex.defaultRestSeconds}s
                </Text>
              </Card>
            ))}

            <Button label="Start workout" onPress={handleStart} style={{ marginTop: spacing.sm }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
