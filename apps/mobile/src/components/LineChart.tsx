import React from 'react'
import { View, Text } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { useTheme } from '@/theme/ThemeContext'

interface LineChartProps {
  data: Array<{ label: string; value: number }>
  height?: number
  width?: number
  target?: number
}

export function LineChart({ data, height = 160, width = 320, target }: LineChartProps) {
  const { colors, typography, spacing } = useTheme()

  if (data.length === 0) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.textMuted, fontFamily: typography.family.regular }}>
          No data yet
        </Text>
      </View>
    )
  }

  const padX = 8
  const padY = 12
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const values = data.map((d) => d.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values, minVal + 1)

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW
  const toY = (v: number) => padY + chartH - ((v - minVal) / (maxVal - minVal)) * chartH

  // Build line path
  const linePath = Skia.Path.Make()
  data.forEach((d, i) => {
    const x = toX(i)
    const y = toY(d.value)
    if (i === 0) linePath.moveTo(x, y)
    else linePath.lineTo(x, y)
  })

  // Build fill path (area under line)
  const fillPath = Skia.Path.Make()
  data.forEach((d, i) => {
    const x = toX(i)
    const y = toY(d.value)
    if (i === 0) fillPath.moveTo(x, y)
    else fillPath.lineTo(x, y)
  })
  fillPath.lineTo(toX(data.length - 1), padY + chartH)
  fillPath.lineTo(padX, padY + chartH)
  fillPath.close()

  // Target dotted line
  const targetPath = target != null ? Skia.Path.Make() : null
  if (targetPath && target != null) {
    const ty = toY(target)
    const dashLen = 6
    for (let x = padX; x < padX + chartW; x += dashLen * 2) {
      targetPath.moveTo(x, ty)
      targetPath.lineTo(Math.min(x + dashLen, padX + chartW), ty)
    }
  }

  return (
    <View>
      <Canvas style={{ width, height }}>
        {/* Fill area */}
        <Path path={fillPath} color={colors.primary + '22'} style="fill" />
        {/* Line */}
        <Path path={linePath} color={colors.primary} style="stroke" strokeWidth={2} strokeCap="round" strokeJoin="round" />
        {/* Target */}
        {targetPath && (
          <Path path={targetPath} color={colors.textMuted} style="stroke" strokeWidth={1.5} />
        )}
      </Canvas>

      {/* X-axis labels */}
      <View style={{ flexDirection: 'row', paddingHorizontal: padX }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            {(i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 4) === 0) && (
              <Text style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}>
                {d.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}
