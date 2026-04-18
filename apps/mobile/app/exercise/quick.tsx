import React, { useState, useMemo } from 'react'
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Modal,
  Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'
import { useActiveSessionStore } from '@/stores/activeSessionStore'
import { useExercises, translateMuscleGroup, translateDifficulty, type Exercise } from '@/hooks/useExercises'

const MUSCLE_GROUPS = [
  'All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Full Body',
]

type SetConfig = { reps: string; weight: string; rest: string }

function ConfigModal({
  exercise,
  onStart,
  onClose,
}: {
  exercise: Exercise
  onStart: (sets: SetConfig[]) => void
  onClose: () => void
}) {
  const { colors, typography, spacing, radius } = useTheme()
  const { t } = useTranslation()
  const [numSets, setNumSets] = useState(3)
  const [sets, setSets] = useState<SetConfig[]>([
    { reps: '10', weight: '0', rest: '90' },
    { reps: '10', weight: '0', rest: '90' },
    { reps: '10', weight: '0', rest: '90' },
  ])

  const updateSets = (count: number) => {
    setNumSets(count)
    setSets((prev) => {
      if (count > prev.length) {
        const last = prev[prev.length - 1] ?? { reps: '10', weight: '0', rest: '90' }
        return [...prev, ...Array.from({ length: count - prev.length }, () => ({ ...last }))]
      }
      return prev.slice(0, count)
    })
  }

  const updateSet = (i: number, field: keyof SetConfig, val: string) => {
    setSets((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  const inputStyle = {
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: typography.family.semiBold,
    fontSize: typography.size.body,
    textAlign: 'center' as const,
    minWidth: 52,
  }

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.base, gap: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.surface2 }}>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Close" accessibilityRole="button" style={{ paddingTop: 2 }}>
            <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.title, color: colors.primary }}>✕</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size.xl, color: colors.textPrimary }} numberOfLines={2}>
              {exercise.name}
            </Text>
            <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted, marginTop: 2 }}>
              {exercise.muscleGroups.map((mg) => translateMuscleGroup(mg, t)).join(' · ')}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.lg }} keyboardShouldPersistTaps="handled">
          {/* Number of sets */}
          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.body, color: colors.textPrimary, textTransform: 'uppercase', letterSpacing: 1 }}>
              Number of sets
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => updateSets(n)}
                  style={{
                    flex: 1, paddingVertical: spacing.md, borderRadius: radius.md,
                    backgroundColor: numSets === n ? colors.primary : colors.surface2,
                    alignItems: 'center',
                  }}
                  accessibilityLabel={`${n} sets`}
                  accessibilityRole="button"
                >
                  <Text style={{
                    fontFamily: typography.family.bold, fontSize: typography.size.body,
                    color: numSets === n ? tokenColors.white : colors.textMuted,
                  }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Column headers */}
          <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs }}>
            <Text style={{ width: 36, fontFamily: typography.family.semiBold, fontSize: typography.size.xs, color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>SET</Text>
            <Text style={{ flex: 1, fontFamily: typography.family.semiBold, fontSize: typography.size.xs, color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>REPS</Text>
            <Text style={{ flex: 1, fontFamily: typography.family.semiBold, fontSize: typography.size.xs, color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>KG</Text>
            <Text style={{ flex: 1, fontFamily: typography.family.semiBold, fontSize: typography.size.xs, color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>REST (s)</Text>
          </View>

          {/* Sets */}
          {sets.map((s, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.body, color: tokenColors.white }}>{i + 1}</Text>
              </View>
              <TextInput value={s.reps} onChangeText={(v) => updateSet(i, 'reps', v)} keyboardType="number-pad" style={{ ...inputStyle, flex: 1 }} accessibilityLabel={`Set ${i + 1} reps`} />
              <TextInput value={s.weight} onChangeText={(v) => updateSet(i, 'weight', v)} keyboardType="decimal-pad" style={{ ...inputStyle, flex: 1 }} accessibilityLabel={`Set ${i + 1} weight`} />
              <TextInput value={s.rest} onChangeText={(v) => updateSet(i, 'rest', v)} keyboardType="number-pad" style={{ ...inputStyle, flex: 1 }} accessibilityLabel={`Set ${i + 1} rest`} />
            </View>
          ))}
        </ScrollView>

        {/* Start button */}
        <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.md, paddingBottom: spacing.sm }}>
          <TouchableOpacity
            onPress={() => onStart(sets)}
            style={{ backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center' }}
            accessibilityLabel="Start exercise" accessibilityRole="button"
          >
            <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size.xl, color: tokenColors.white, textTransform: 'uppercase', letterSpacing: 1 }}>
              Start exercise →
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default function QuickExerciseScreen() {
  const { colors, typography, spacing, radius } = useTheme()
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState('All')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const { t } = useTranslation()
  const { data: exercises, isLoading } = useExercises()
  const startSession = useActiveSessionStore((s) => s.startSession)

  const filtered = useMemo(() => {
    if (!exercises) return []
    return exercises.filter((e) => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
      const matchMuscle = muscle === 'All' || e.muscleGroups.includes(muscle)
      return matchSearch && matchMuscle
    })
  }, [exercises, search, muscle])

  const handleStart = (sets: SetConfig[]) => {
    if (!selected) return
    const sessionSets = sets.map((s) => ({
      reps: parseInt(s.reps) || 10,
      weight: parseFloat(s.weight) || 0,
      restSeconds: parseInt(s.rest) || 90,
      isCompleted: false,
    }))
    startSession(
      { id: selected.id, name: selected.name },
      [{
        exerciseId: selected.id,
        exerciseName: selected.name,
        defaultSets: sets.length,
        defaultReps: parseInt(sets[0]?.reps ?? '10') || 10,
        defaultWeight: parseFloat(sets[0]?.weight ?? '0') || 0,
        defaultRestSeconds: parseInt(sets[0]?.rest ?? '90') || 90,
        sets: sessionSets,
      }],
      true, // isQuick
    )
    setSelected(null)
    router.push('/workout/active')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: spacing.md }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.title, color: colors.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size.xl, color: colors.textPrimary, flex: 1 }}>
          Pick an exercise
        </Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: spacing.base, gap: spacing.sm, paddingBottom: spacing.sm }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search exercises..."
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.md,
            color: colors.textPrimary,
            fontFamily: typography.family.regular,
            fontSize: typography.size.body,
          }}
          accessibilityLabel="Search exercises"
          autoFocus
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {MUSCLE_GROUPS.map((mg) => {
              const label = translateMuscleGroup(mg, t)
              return (
                <TouchableOpacity
                  key={mg}
                  onPress={() => setMuscle(mg)}
                  style={{
                    paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
                    borderRadius: radius.pill,
                    backgroundColor: muscle === mg ? colors.primary : colors.surface2,
                  }}
                  accessibilityLabel={label} accessibilityRole="button"
                >
                  <Text style={{
                    fontFamily: muscle === mg ? typography.family.semiBold : typography.family.regular,
                    fontSize: typography.size.base,
                    color: muscle === mg ? tokenColors.white : colors.textMuted,
                  }}>{label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.base, gap: spacing.sm, paddingBottom: spacing.xl }}>
        {isLoading && [1,2,3,4,5].map((i) => (
          <View key={i} style={{ height: 64, backgroundColor: colors.surface, borderRadius: radius.md }} />
        ))}
        {filtered.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            onPress={() => setSelected(ex)}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              padding: spacing.base,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            accessibilityLabel={`Select ${ex.name}`} accessibilityRole="button"
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.body, color: colors.textPrimary }}>
                {ex.name}
              </Text>
              <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
                {ex.muscleGroups.map((mg) => translateMuscleGroup(mg, t)).join(' · ')} · {translateDifficulty(ex.difficulty, t)}
              </Text>
            </View>
            <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.title, color: colors.primary }}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected && (
        <ConfigModal
          exercise={selected}
          onStart={handleStart}
          onClose={() => setSelected(null)}
        />
      )}
    </SafeAreaView>
  )
}
