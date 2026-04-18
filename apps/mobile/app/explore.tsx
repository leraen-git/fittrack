import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, type Href } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { trpc } from '@/lib/trpc'
import { colors as tokenColors } from '@/theme/tokens'
import { useNotificationSettingsStore } from '@/stores/notificationSettingsStore'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FeatureItem {
  icon: string
  title: string
  desc: string
  route: Href
  isNew?: boolean
  used: boolean
  locked?: boolean
}

interface FeatureGroup {
  label: string
  items: FeatureItem[]
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ item }: { item: FeatureItem }) {
  const { colors, typography, spacing, radius } = useTheme()
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      onPress={item.locked ? undefined : () => router.push(item.route)}
      disabled={item.locked}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.base,
        opacity: item.locked ? 0.4 : 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.surface2,
        gap: spacing.md,
      }}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      {/* Icon label */}
      <View style={{
        width: 40, height: 40,
        borderRadius: radius.md,
        backgroundColor: colors.surface2,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xs, color: colors.textMuted, letterSpacing: 0.5 }}>{item.icon}</Text>
      </View>

      {/* Text */}
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={{
            fontFamily: typography.family.semiBold,
            fontSize: typography.size.body,
            color: colors.textPrimary,
          }}>
            {item.title}
          </Text>
          {item.isNew && (
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: radius.pill,
              paddingHorizontal: 6, paddingVertical: 1,
            }}>
              <Text style={{
                fontFamily: typography.family.bold,
                fontSize: typography.size.xs,
                color: tokenColors.white,
                letterSpacing: 0.5,
              }}>
                {t('explore.new')}
              </Text>
            </View>
          )}
        </View>
        <Text style={{
          fontFamily: typography.family.regular,
          fontSize: typography.size.base,
          color: colors.textMuted,
          lineHeight: 18,
        }}>
          {item.desc}
        </Text>
      </View>

      {/* Right side */}
      {!item.used ? (
        <View style={{
          backgroundColor: `${colors.primary}15`,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: 3,
        }}>
          <Text style={{
            fontFamily: typography.family.semiBold,
            fontSize: typography.size.xs,
            color: colors.primary,
          }}>
            {t('explore.tryIt')}
          </Text>
        </View>
      ) : (
        <Text style={{ color: colors.textMuted, fontSize: typography.size.body }}>›</Text>
      )}
    </TouchableOpacity>
  )
}

// ─── Group block ──────────────────────────────────────────────────────────────

function GroupBlock({ group }: { group: FeatureGroup }) {
  const { colors, typography, spacing } = useTheme()
  return (
    <View>
      <Text style={{
        fontFamily: typography.family.semiBold,
        fontSize: typography.size.xs,
        color: colors.textMuted,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        paddingHorizontal: spacing.base,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xs,
      }}>
        {group.label}
      </Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: spacing.base, overflow: 'hidden' }}>
        {group.items.map((item) => (
          <FeatureRow key={item.title} item={item} />
        ))}
      </View>
    </View>
  )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const { colors, typography, spacing } = useTheme()
  const { t } = useTranslation()

  // Dynamic signals — lightweight queries
  const { data: user }       = trpc.users.me.useQuery()
  const isGuest = user?.authProvider === 'guest'
  const { data: sessions }   = trpc.sessions.history.useQuery({ limit: 5 })
  const { data: records }    = trpc.progress.records.useQuery()
  const { data: dietMeals }  = trpc.diet.todayMeals.useQuery()
  const { data: activePlan } = trpc.plans.active.useQuery()
  const notifSettings        = useNotificationSettingsStore()

  const hasSessions   = (sessions?.length ?? 0) > 0
  const hasRecords    = (records?.length ?? 0) > 0
  const hasDiet       = !!dietMeals
  const hasWorkoutPlan = !!activePlan
  const hasReminders  = notifSettings.workoutEnabled
    || Object.values(notifSettings.meals).some((m) => m.enabled)
    || notifSettings.hydrationEnabled

  const groups: FeatureGroup[] = [
    {
      label: t('explore.groupWorkouts'),
      items: [
        {
          icon: 'WK',
          title: t('explore.workoutBuilder'),
          desc: t('explore.workoutBuilderDesc'),
          route: '/(tabs)/workouts',
          used: hasSessions,
        },
        {
          icon: '▶',
          title: t('explore.activeSession'),
          desc: t('explore.activeSessionDesc'),
          route: '/(tabs)/workouts',
          used: hasSessions,
        },
        {
          icon: 'T',
          title: t('explore.restTimer'),
          desc: t('explore.restTimerDesc'),
          route: '/(tabs)/workouts',
          used: hasSessions,
        },
        {
          icon: 'PR',
          title: t('explore.personalRecords'),
          desc: t('explore.personalRecordsDesc'),
          route: '/(tabs)/history',
          used: hasRecords,
        },
      ],
    },
    {
      label: t('explore.groupProgress'),
      items: [
        {
          icon: '↗',
          title: t('explore.progressCharts'),
          desc: t('explore.progressChartsDesc'),
          route: '/(tabs)/history',
          used: hasSessions,
        },
        {
          icon: 'ST',
          title: t('explore.streakStats'),
          desc: t('explore.streakStatsDesc'),
          route: '/(tabs)/history',
          used: hasSessions,
        },
        {
          icon: 'RC',
          title: t('explore.sessionRecap'),
          desc: t('explore.sessionRecapDesc'),
          route: '/(tabs)/workouts',
          used: hasSessions,
        },
      ],
    },
    {
      label: t('explore.groupPlans'),
      items: [
        {
          icon: 'AI',
          title: isGuest ? t('guest.aiLocked') : t('explore.aiWorkoutPlan'),
          desc: isGuest ? t('guest.aiLockedDesc') : t('explore.aiWorkoutPlanDesc'),
          route: '/plans/generate',
          isNew: !isGuest,
          used: hasWorkoutPlan,
          locked: isGuest,
        },
        {
          icon: 'PG',
          title: t('explore.guidedPrograms'),
          desc: t('explore.guidedProgramsDesc'),
          route: '/(tabs)/workouts',
          used: false,
        },
      ],
    },
    {
      label: t('explore.groupDiet'),
      items: [
        {
          icon: 'AI',
          title: isGuest ? t('guest.aiLocked') : t('explore.aiDietPlan'),
          desc: isGuest ? t('guest.aiLockedDesc') : t('explore.aiDietPlanDesc'),
          route: '/(tabs)/diet',
          isNew: !isGuest,
          used: hasDiet,
          locked: isGuest,
        },
        {
          icon: 'MR',
          title: t('explore.mealRecipes'),
          desc: t('explore.mealRecipesDesc'),
          route: '/(tabs)/diet',
          used: hasDiet,
        },
      ],
    },
    {
      label: t('explore.groupReminders'),
      items: [
        {
          icon: '—',
          title: t('explore.reminders'),
          desc: t('explore.remindersDesc'),
          route: '/settings/reminders',
          isNew: true,
          used: hasReminders,
        },
      ],
    },
  ]

  // Usage summary
  const totalFeatures = groups.reduce((n, g) => n + g.items.length, 0)
  const usedFeatures  = groups.reduce((n, g) => n + g.items.filter((i) => i.used).length, 0)

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: spacing.md }}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel={t('common.back')}
          accessibilityRole="button"
        >
          <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.title, color: colors.primary }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size.xl, color: colors.textPrimary }}>
            {t('explore.title')}
          </Text>
          <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.base, color: colors.textMuted }}>
            {t('explore.subtitle', { used: usedFeatures, total: totalFeatures })}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => (
          <GroupBlock key={group.label} group={group} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
