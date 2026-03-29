import React, { useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/ThemeContext'
import { PillFilter } from '@/components/PillFilter'
import { StatCard } from '@/components/StatCard'
import { Card } from '@/components/Card'
import { trpc } from '@/lib/trpc'

const TIME_FILTERS = ['4w', '3m', '6m', 'All']

export default function HistoryScreen() {
  const { colors, typography, spacing } = useTheme()
  const [filter, setFilter] = useState('4w')
  const { data: sessions } = trpc.sessions.history.useQuery({ limit: 100 })
  const { data: records } = trpc.progress.records.useQuery()

  const totalVolume = sessions?.reduce((s, r) => s + r.totalVolume, 0) ?? 0
  const weeklyAvg = sessions ? (sessions.length / 4).toFixed(1) : '0'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}>
        <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>
          Progress
        </Text>

        <PillFilter options={TIME_FILTERS} selected={filter} onSelect={setFilter} />

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <StatCard label="Total volume" value={`${(totalVolume / 1000).toFixed(1)}t`} trend="up" />
          <StatCard label="Sessions" value={String(sessions?.length ?? 0)} trend="neutral" />
          <StatCard label="/week avg" value={weeklyAvg} trend="neutral" />
        </View>

        <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
          Personal Records
        </Text>
        {records?.slice(0, 10).map((r) => (
          <Card key={r.id} accessibilityLabel={`Personal record for exercise`}>
            <Text style={{ fontFamily: typography.family.semiBold, color: colors.textPrimary }}>
              {r.weight}kg × {r.reps} reps
            </Text>
            <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
              {new Date(r.achievedAt).toLocaleDateString()}
            </Text>
          </Card>
        ))}
        {records?.length === 0 && (
          <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted }}>
            No personal records yet. Keep training!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
