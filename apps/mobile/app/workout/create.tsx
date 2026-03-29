import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { trpc } from '@/lib/trpc'

export default function CreateWorkoutScreen() {
  const { colors, typography, spacing, radius } = useTheme()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const utils = trpc.useUtils()

  const createWorkout = trpc.workouts.create.useMutation({
    onSuccess: () => {
      utils.workouts.list.invalidate()
      router.back()
    },
  })

  const inputStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontFamily: typography.family.regular,
    fontSize: typography.size.body,
    marginTop: spacing.xs,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
          New workout
        </Text>

        <View>
          <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted }}>Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={inputStyle}
            placeholder="e.g. Push Day A"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Workout name"
          />
        </View>

        <View>
          <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted }}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[inputStyle, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Optional notes..."
            placeholderTextColor={colors.textMuted}
            multiline
            accessibilityLabel="Workout description"
          />
        </View>

        <Button
          label="Create workout"
          onPress={() => createWorkout.mutate({ name, description })}
          loading={createWorkout.isPending}
          disabled={!name.trim()}
        />
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  )
}
