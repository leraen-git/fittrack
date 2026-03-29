import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { SkeletonCard } from '@/components/SkeletonCard'
import { ProgressBar } from '@/components/ProgressBar'
import { trpc } from '@/lib/trpc'

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { colors, typography, spacing } = useTheme()

  const { data: program, isLoading } = trpc.programs.byId.useQuery({ id })
  const enroll = trpc.programs.enroll.useMutation({
    onSuccess: () => {
      router.push('/(tabs)/index' as any)
    },
  })

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Button label="← Back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />

        {isLoading && (
          <>
            <SkeletonCard height={40} />
            <SkeletonCard height={120} />
            <SkeletonCard height={80} />
          </>
        )}

        {program && (
          <>
            <View>
              <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
                {program.name}
              </Text>
              <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.body, color: colors.textMuted, marginTop: spacing.xs }}>
                {program.description}
              </Text>
            </View>

            {/* Stats */}
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Card style={{ flex: 1 }} accessibilityLabel="Program duration">
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>Duration</Text>
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
                  {program.durationWeeks}wk
                </Text>
              </Card>
              <Card style={{ flex: 1 }} accessibilityLabel="Sessions per week">
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>Days/week</Text>
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
                  {program.sessionsPerWeek}d
                </Text>
              </Card>
              <Card style={{ flex: 1 }} accessibilityLabel="Program level">
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>Level</Text>
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.body, color: colors.textPrimary }}>
                  {program.level.charAt(0) + program.level.slice(1).toLowerCase()}
                </Text>
              </Card>
            </View>

            {/* Goal badge */}
            <Card accessibilityLabel="Program goal">
              <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted, marginBottom: spacing.xs }}>
                Goal
              </Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: colors.primary + '22',
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: 9999,
                }}
              >
                <Text style={{ fontFamily: typography.family.bold, color: colors.primary }}>
                  {program.goal.replace('_', ' ')}
                </Text>
              </View>
            </Card>

            {/* Week overview */}
            <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
              Week overview
            </Text>
            {Array.from({ length: Math.min(program.durationWeeks, 4) }).map((_, wi) => (
              <Card key={wi} accessibilityLabel={`Week ${wi + 1}`}>
                <Text style={{ fontFamily: typography.family.semiBold, color: colors.textPrimary }}>
                  Week {wi + 1}
                </Text>
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
                  {program.sessionsPerWeek} sessions planned
                </Text>
                <View style={{ marginTop: spacing.sm }}>
                  <ProgressBar start={0} current={0} target={program.sessionsPerWeek} unit="" />
                </View>
              </Card>
            ))}
            {program.durationWeeks > 4 && (
              <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted, textAlign: 'center' }}>
                + {program.durationWeeks - 4} more weeks after enrollment
              </Text>
            )}

            <Button
              label="Start program"
              onPress={() => enroll.mutate({ programId: program.id })}
              loading={enroll.isPending}
              style={{ marginTop: spacing.sm }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
