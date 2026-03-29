import React from 'react'
import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { StatCard } from '@/components/StatCard'
import { Card } from '@/components/Card'
import { SkeletonCard } from '@/components/SkeletonCard'
import { trpc } from '@/lib/trpc'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeScreen() {
  const { colors, typography, spacing } = useTheme()
  const { data: user, isLoading: userLoading } = trpc.users.me.useQuery()
  const { data: sessions, refetch, isRefetching } = trpc.sessions.history.useQuery({ limit: 5 })
  const { data: programs } = trpc.programs.list.useQuery()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.base, gap: spacing.base }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {/* Greeting */}
        <View>
          <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.body, color: colors.textMuted }}>
            {getGreeting()},
          </Text>
          {userLoading ? (
            <SkeletonCard height={36} />
          ) : (
            <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['3xl'], color: colors.textPrimary }}>
              {user?.name.split(' ')[0] ?? 'Athlete'} 👋
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <StatCard label="Day streak" value="0" trend="neutral" />
          <StatCard label="Sessions" value={String(sessions?.length ?? 0)} trend="up" />
          <StatCard label="Volume %" value="+0%" trend="up" />
        </View>

        {/* CTA */}
        <Button
          label="New session"
          onPress={() => router.push('/workout/create')}
          style={{ width: '100%' }}
        />

        {/* Recent workouts */}
        <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
          Recent workouts
        </Text>
        {sessions?.length === 0 && (
          <Text style={{ fontFamily: typography.family.regular, color: colors.textMuted }}>
            No sessions yet. Start your first workout!
          </Text>
        )}
        {sessions?.map((s) => (
          <Card key={s.id} onPress={() => router.push(`/workout/${s.id}`)} accessibilityLabel={`Workout on ${new Date(s.startedAt).toLocaleDateString()}`}>
            <Text style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.body, color: colors.textPrimary }}>
              {new Date(s.startedAt).toLocaleDateString()}
            </Text>
            <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
              {Math.round(s.durationSeconds / 60)} min · {s.totalVolume.toLocaleString()} kg total
            </Text>
          </Card>
        ))}

        {/* Programs shelf */}
        <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.textPrimary }}>
          Guided programs
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {programs?.map((p) => (
              <Card
                key={p.id}
                onPress={() => router.push(`/programs/${p.id}`)}
                style={{ width: 200 }}
                accessibilityLabel={`Program: ${p.name}`}
              >
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.body, color: colors.textPrimary }}>
                  {p.name}
                </Text>
                <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
                  {p.durationWeeks}wk · {p.sessionsPerWeek}d/wk
                </Text>
              </Card>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}
