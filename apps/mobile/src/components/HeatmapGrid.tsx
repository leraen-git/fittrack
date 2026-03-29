import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'

interface HeatmapGridProps {
  data: Array<{ date: Date; value: number }>
  weeks?: number
}

function getIntensityColor(value: number, max: number): string {
  if (value === 0) return tokenColors.heatmap[0]!
  const ratio = value / max
  if (ratio < 0.25) return tokenColors.heatmap[1]!
  if (ratio < 0.5) return tokenColors.heatmap[2]!
  if (ratio < 0.75) return tokenColors.heatmap[3]!
  return tokenColors.heatmap[4]!
}

export function HeatmapGrid({ data, weeks = 16 }: HeatmapGridProps) {
  const { colors, typography, spacing, radius } = useTheme()

  const cellSize = 14
  const cellGap = 3

  // Build a date-keyed map
  const dataMap = new Map<string, number>()
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  for (const entry of data) {
    const key = entry.date.toISOString().slice(0, 10)
    dataMap.set(key, (dataMap.get(key) ?? 0) + entry.value)
  }

  // Build grid: 7 rows (Mon–Sun) × N weeks columns
  const today = new Date()
  const grid: Array<Array<{ date: Date; value: number }>> = []

  for (let w = weeks - 1; w >= 0; w--) {
    const col: Array<{ date: Date; value: number }> = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - w * 7 - (6 - d))
      const key = date.toISOString().slice(0, 10)
      col.push({ date, value: dataMap.get(key) ?? 0 })
    }
    grid.push(col)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: cellGap }}>
        {grid.map((col, wi) => (
          <View key={wi} style={{ flexDirection: 'column', gap: cellGap }}>
            {col.map((cell, di) => (
              <View
                key={di}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: radius.sm / 2,
                  backgroundColor: getIntensityColor(cell.value, maxValue),
                }}
                accessibilityLabel={`${cell.date.toLocaleDateString()}: ${cell.value.toFixed(0)} kg volume`}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm }}>
        <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
          Less
        </Text>
        {tokenColors.heatmap.map((c, i) => (
          <View
            key={i}
            style={{ width: cellSize, height: cellSize, borderRadius: radius.sm / 2, backgroundColor: c }}
          />
        ))}
        <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
          More
        </Text>
      </View>
    </View>
  )
}
