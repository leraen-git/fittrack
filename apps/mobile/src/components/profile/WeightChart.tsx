import React from 'react'
import { View } from 'react-native'
// @ts-expect-error react-native-svg named exports work at runtime
import Svg, { Polyline, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop, Polygon } from 'react-native-svg'
import { useTheme } from '@/theme/ThemeContext'
import type { WeightEntry } from '@tanren/shared'

interface WeightChartProps {
  entries: WeightEntry[]
  height?: number
}

export function WeightChart({ entries, height = 130 }: WeightChartProps) {
  const { tokens, fonts } = useTheme()

  if (entries.length < 2) return null

  const sorted = [...entries].sort(
    (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime(),
  )

  const weights = sorted.map(e => e.weightKg)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const range = maxW - minW || 1

  const chartWidth = 300
  const chartHeight = 100
  const padLeft = 40
  const padRight = 10
  const padTop = 10
  const padBottom = 10
  const plotW = chartWidth - padLeft - padRight
  const plotH = chartHeight - padTop - padBottom

  const points = sorted.map((e, i) => {
    const x = padLeft + (i / (sorted.length - 1)) * plotW
    const y = padTop + plotH - ((e.weightKg - minW) / range) * plotH
    return { x, y }
  })

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ')
  const last = points[points.length - 1]!

  const polygonStr = [
    ...points.map(p => `${p.x},${p.y}`),
    `${points[points.length - 1]!.x},${padTop + plotH}`,
    `${points[0]!.x},${padTop + plotH}`,
  ].join(' ')

  const gridYs = [0.25, 0.5, 0.75]
  const labelValues = [maxW, minW + range * 0.5, minW]

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16 }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={tokens.accent} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={tokens.accent} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {/* Grid lines */}
        {gridYs.map((ratio) => {
          const y = padTop + plotH * (1 - ratio)
          return (
            <Line
              key={ratio}
              x1={padLeft}
              y1={y}
              x2={chartWidth - padRight}
              y2={y}
              stroke={tokens.border}
              strokeWidth={0.5}
              strokeDasharray="2,2"
            />
          )
        })}

        {/* Area fill */}
        <Polygon points={polygonStr} fill="url(#areaFill)" />

        {/* Line */}
        <Polyline
          points={polylineStr}
          fill="none"
          stroke={tokens.accent}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Last point glow */}
        <Circle cx={last.x} cy={last.y} r={5} fill={tokens.accent} opacity={0.3} />
        <Circle cx={last.x} cy={last.y} r={3} fill={tokens.accent} />

        {/* Y-axis labels */}
        {labelValues.map((val, i) => {
          const y = padTop + (i === 0 ? 0 : i === 1 ? plotH * 0.5 : plotH)
          return (
            <SvgText
              key={i}
              x={padLeft - 4}
              y={y + 3}
              textAnchor="end"
              fontSize={7}
              fontFamily={fonts.mono}
              fill={tokens.textMute}
            >
              {val.toFixed(1)}
            </SvgText>
          )
        })}
      </Svg>
    </View>
  )
}
