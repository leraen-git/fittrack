import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { ScreenHeader } from '@/components/ScreenHeader'

export default function HealthScreen() {
  const { t } = useTranslation()
  const { tokens, fonts } = useTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }} edges={['top']}>
      <ScreenHeader title={t('profile.healthTitle')} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <Text style={{
          fontFamily: fonts.jp,
          fontSize: 40,
          color: tokens.text,
          opacity: 0.4,
        }}>
          鍛
        </Text>

        <Text style={{
          fontFamily: fonts.sansX,
          fontSize: 14,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: tokens.accent,
          marginTop: 16,
        }}>
          {t('profile.healthSoonTitle')}
        </Text>

        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: tokens.textMute,
          textAlign: 'center',
          lineHeight: 18,
          marginTop: 12,
          maxWidth: 260,
        }}>
          {t('profile.healthSoonDesc')}
        </Text>
      </View>
    </SafeAreaView>
  )
}
