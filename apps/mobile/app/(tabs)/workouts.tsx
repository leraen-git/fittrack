import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { SkeletonCard } from '@/components/SkeletonCard'
import { trpc } from '@/lib/trpc'

export default function WorkoutsScreen() {
  const { colors, typography, spacing } = useTheme()
  const { data: workouts, isLoading } = trpc.workouts.list.useQuery()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
            My Workouts
          </Text>
          <Button label="+ New" variant="secondary" onPress={() => router.push('/workout/create')} />
        </View>

        {isLoading && [1, 2, 3].map((i) => <SkeletonCard key={i} height={80} />)}

        {workouts?.map((w) => (
          <Card key={w.id} onPress={() => router.push(`/workout/${w.id}`)} accessibilityLabel={`Workout: ${w.name}`}>
            <Text style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.body, color: colors.textPrimary }}>
              {w.name}
            </Text>
            <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
              {w.muscleGroups.join(' · ')} · ~{w.estimatedDuration} min
            </Text>
          </Card>
        ))}

        {!isLoading && workouts?.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
            <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted, textAlign: 'center' }}>
              No workouts yet.{'\n'}Create your first one!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
