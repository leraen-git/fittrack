import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/ThemeContext'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { trpc } from '@/lib/trpc'

export default function ProfileScreen() {
  const { colors, typography, spacing } = useTheme()
  const { data: user } = trpc.users.me.useQuery()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
          Profile
        </Text>

        <Card accessibilityLabel="User profile">
          <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
            {user?.name ?? '—'}
          </Text>
          <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
            {user?.email ?? '—'}
          </Text>
        </Card>

        <Card accessibilityLabel="Training preferences">
          <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted, marginBottom: spacing.xs }}>
            Level
          </Text>
          <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>
            {user?.level ?? '—'}
          </Text>
          <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xs }}>
            Goal
          </Text>
          <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>
            {user?.goal?.replace('_', ' ') ?? '—'}
          </Text>
          <Text style={{ fontFamily: typography.family.semiBold, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xs }}>
            Weekly target
          </Text>
          <Text style={{ fontFamily: typography.family.bold, color: colors.textPrimary }}>
            {user?.weeklyTarget ?? 0} sessions/week
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}
