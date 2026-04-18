import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/ThemeContext'
import { trpc } from '@/lib/trpc'

export function GuestBanner() {
  const { colors, typography, spacing } = useTheme()
  const { t } = useTranslation()
  const { data: user } = trpc.users.me.useQuery()
  const insets = useSafeAreaInsets()

  if (user?.authProvider !== 'guest') return null

  return (
    <TouchableOpacity
      onPress={() => router.push('/sign-in?upgrade=1')}
      style={{
        backgroundColor: `${colors.warning}22`,
        borderBottomWidth: 1,
        borderBottomColor: `${colors.warning}44`,
        paddingTop: insets.top + spacing.xs,
        paddingBottom: spacing.sm,
        paddingHorizontal: spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
      }}
      accessibilityLabel={t('guestBanner.message')}
      accessibilityRole="button"
    >
      <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.warning, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: typography.family.bold, fontSize: 8, color: colors.warning }}>!</Text>
      </View>
      <Text style={{
        fontFamily: typography.family.regular,
        fontSize: typography.size.xs,
        color: colors.warning,
        flex: 1,
      }}>
        {t('guestBanner.message')}
      </Text>
      <Text style={{
        fontFamily: typography.family.semiBold,
        fontSize: typography.size.xs,
        color: colors.warning,
      }}>
        {t('guestBanner.signIn')} →
      </Text>
    </TouchableOpacity>
  )
}
