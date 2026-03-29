import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface BarChartProps {
  data: Array<{ label: string; value: number; isCurrent?: boolean }>
  height?: number
}

export function BarChart({ data, height = 120 }: BarChartProps) {
  const { colors, typography, spacing } = useTheme()

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <View style={{ height: height + 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 4 }}>
        {data.map((item, i) => {
          const barHeight = Math.max((item.value / max) * height, 2)
          const isActive = item.isCurrent ?? false
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', height }}>
              <View style={{ flex: 1, justifyContent: 'flex-end', width: '100%' }}>
                <View
                  style={{
                    height: barHeight,
                    backgroundColor: isActive ? colors.primary : colors.surface2,
                    borderRadius: 3,
                    width: '100%',
                  }}
                  accessibilityLabel={`Week ${item.label}: ${item.value.toFixed(0)} kg`}
                />
              </View>
            </View>
          )
        })}
      </View>
      {/* X-axis labels (show every 4th to avoid crowding) */}
      <View style={{ flexDirection: 'row', gap: 4, marginTop: spacing.xs }}>
        {data.map((item, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            {i % 4 === 0 && (
              <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
                {item.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}
