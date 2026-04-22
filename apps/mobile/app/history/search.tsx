import React, { useState, useMemo } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { useTranslation } from 'react-i18next'
import { trpc } from '@/lib/trpc'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { SessionCard } from '@/components/SessionCard'

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function HistorySearchScreen() {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)

  const { data, isLoading } = trpc.history.search.useQuery(
    { query: debounced },
    { enabled: debounced.length >= 2 },
  )

  const results = data ?? []

  return (
    <Screen>
      <ScreenHeader title={t('history.searchTitle')} />

      {/* Search input */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('history.searchPlaceholder')}
          placeholderTextColor={tokens.textMute}
          autoFocus
          style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            color: tokens.text,
            borderWidth: 1,
            borderColor: tokens.border,
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: tokens.surface1,
          }}
          accessibilityLabel={t('history.searchPlaceholder')}
        />
      </View>

      {debounced.length < 2 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.textMute }}>
            {t('history.searchMinChars')}
          </Text>
        </View>
      ) : isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.textMute }}>
            {t('common.loading')}
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 20, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.textMute }}>
            {t('history.searchNoResults', { query: debounced })}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onPress={() => {
                router.push(`/session/${item.id}`)
              }}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingBottom: 20 }}
        />
      )}
    </Screen>
  )
}
