import React, { useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { SetRow } from '@/components/SetRow'
import { TimerRing } from '@/components/TimerRing'
import { useActiveSessionStore } from '@/stores/activeSessionStore'
import { useTimerStore } from '@/stores/timerStore'
import { scheduleRestEndNotification } from '@/services/timerService'

export default function ActiveWorkoutScreen() {
  const { colors, typography, spacing, radius } = useTheme()
  const {
    currentWorkout,
    exercises,
    currentExerciseIndex,
    sets,
    completeSet,
    updateSet,
    initSetsForExercise,
    nextExercise,
    prevExercise,
  } = useActiveSessionStore()
  const { isRunning, secondsRemaining, totalSeconds, start, skip, addSeconds } = useTimerStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentExercise = exercises[currentExerciseIndex]

  // Init sets for the current exercise when it changes
  useEffect(() => {
    if (!currentExercise) return
    initSetsForExercise(currentExercise.exerciseId, currentExercise.defaultSets, {
      reps: currentExercise.defaultReps,
      weight: currentExercise.defaultWeight,
      restSeconds: currentExercise.defaultRestSeconds,
    })
  }, [currentExercise?.exerciseId])

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        useTimerStore.getState().tick()
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  if (!currentWorkout || !currentExercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', gap: spacing.base }}>
        <Text style={{ color: colors.textMuted, fontFamily: typography.family.regular }}>
          No active workout
        </Text>
        <Button label="Go back" onPress={() => router.back()} />
      </SafeAreaView>
    )
  }

  const exerciseSets = sets.get(currentExercise.exerciseId) ?? []

  const handleValidateSet = async (setIndex: number) => {
    completeSet(currentExercise.exerciseId, setIndex)
    const restSecs = currentExercise.defaultRestSeconds
    start(restSecs, currentExercise.exerciseName)
    await scheduleRestEndNotification(restSecs, currentExercise.exerciseName)
  }

  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Text style={{ color: colors.primary, fontFamily: typography.family.semiBold }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.body, color: colors.textPrimary }}>
            {currentWorkout.name}
          </Text>
          <Button label="Finish" variant="ghost" onPress={() => router.push('/workout/recap')} />
        </View>

        {/* Exercise name + progress */}
        <View>
          <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
            {currentExercise.exerciseName}
          </Text>
          <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted }}>
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </Text>
        </View>

        {/* Exercise navigation */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Button
            label="← Prev"
            variant="secondary"
            onPress={prevExercise}
            disabled={currentExerciseIndex === 0}
            style={{ flex: 1 }}
          />
          <Button
            label="Next →"
            variant="secondary"
            onPress={nextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
            style={{ flex: 1 }}
          />
        </View>

        {/* Rest timer */}
        {isRunning && (
          <View style={{ alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.base }}>
            <TimerRing progress={progress} secondsRemaining={secondsRemaining} size={160} />
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button label="-15s" variant="secondary" onPress={() => addSeconds(-15)} />
              <Button label="Skip" variant="ghost" onPress={skip} />
              <Button label="+15s" variant="secondary" onPress={() => addSeconds(15)} />
            </View>
          </View>
        )}

        {/* Sets */}
        <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>Sets</Text>
        {exerciseSets.map((s, idx) => (
          <SetRow
            key={idx}
            setNumber={idx + 1}
            reps={s.reps ?? 0}
            weight={s.weight ?? 0}
            isCompleted={s.isCompleted ?? false}
            onRepsChange={(v) => updateSet(currentExercise.exerciseId, idx, { reps: v })}
            onWeightChange={(v) => updateSet(currentExercise.exerciseId, idx, { weight: v })}
            onComplete={() => handleValidateSet(idx)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
