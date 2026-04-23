import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import type { WeightEntry } from '@tanren/shared'

interface WeightEntryRowProps {
  entry: WeightEntry
  previousEntry?: WeightEntry
  onLongPress?: () => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  const time = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (diffDays === 0) return `Aujourd'hui · ${time}`
  if (diffDays === 1) return `Hier · ${time}`
  const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  return `${dateStr} · ${time}`
}

export function WeightEntryRow({ entry, previousEntry, onLongPress }: WeightEntryRowProps) {
  const { tokens, fonts } = useTheme()

  const delta = previousEntry
    ? Math.round((entry.weightKg - previousEntry.weightKg) * 10) / 10
    : null

  const deltaColor = delta != null
    ? delta < -0.05 ? tokens.green : delta > 0.05 ? tokens.amber : tokens.textMute
    : undefined

  const deltaStr = delta != null
    ? `${delta > 0 ? '+' : ''}${delta.toFixed(1).replace('.', ',')}`
    : null

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      delayLongPress={500}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: tokens.border,
      }}
      accessibilityLabel={`${entry.weightKg} kg`}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.textMute }}>
          {formatDate(entry.measuredAt)}
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.monoB, fontSize: 14, color: tokens.text }}>
        {entry.weightKg.toFixed(1).replace('.', ',')}
      </Text>
      <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: tokens.textMute, marginLeft: 2 }}>
        kg
      </Text>

      {deltaStr && (
        <Text style={{
          fontFamily: fonts.sansB,
          fontSize: 11,
          color: deltaColor,
          marginLeft: 10,
          minWidth: 40,
          textAlign: 'right',
        }}>
          {deltaStr}
        </Text>
      )}
    </TouchableOpacity>
  )
}
