import React, { useState, useCallback } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { syncQueue } from '@/lib/syncQueue'
import { useTranslation } from 'react-i18next'

export function SyncStatusBanner() {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()
  const [count, setCount] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setCount(syncQueue.count())
    }, []),
  )

  if (count === 0) return null

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: tokens.amber,
        marginTop: 16,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.sansB,
          fontSize: 11,
          letterSpacing: 0.2 * 11,
          color: tokens.amber,
          textTransform: 'uppercase',
        }}
      >
        {count} {count === 1 ? t('profile.syncPendingSingular') : t('profile.syncPendingPlural')}
      </Text>
      <Pressable
        onPress={() => {
          // Trigger re-read — the sync worker will flush on next cycle
          setCount(syncQueue.count())
        }}
      >
        <Text
          style={{
            fontFamily: fonts.sansB,
            fontSize: 11,
            color: tokens.accent,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {t('profile.syncNow')}
        </Text>
      </Pressable>
    </View>
  )
}
