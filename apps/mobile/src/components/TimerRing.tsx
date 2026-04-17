import React from 'react'
import { View, Text } from 'react-native'
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { useTheme } from '@/theme/ThemeContext'

interface TimerRingProps {
  progress: number // 0–1, where 1 = full ring
  secondsRemaining: number
  size?: number
}

export const TimerRing = React.memo(function TimerRing({ progress, secondsRemaining, size = 200 }: TimerRingProps) {
  const { colors, typography } = useTheme()

  const strokeWidth = 12
  const center = size / 2
  const radius = center - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  const mins = Math.floor(secondsRemaining / 60)
  const secs = secondsRemaining % 60
  const timeLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  // Build arc path using Skia
  const startAngle = -Math.PI / 2 // top of circle
  const sweepAngle = 2 * Math.PI * progress

  const path = Skia.Path.Make()
  path.addArc(
    { x: strokeWidth / 2, y: strokeWidth / 2, width: size - strokeWidth, height: size - strokeWidth },
    -90,
    360 * progress,
  )

  const trackPath = Skia.Path.Make()
  trackPath.addArc(
    { x: strokeWidth / 2, y: strokeWidth / 2, width: size - strokeWidth, height: size - strokeWidth },
    -90,
    360,
  )

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={{ width: size, height: size, position: 'absolute' }}>
        {/* Track */}
        <Path
          path={trackPath}
          color={colors.surface2}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
        {/* Progress arc */}
        <Path
          path={path}
          color={colors.primary}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
      </Canvas>

      {/* Time label */}
      <Text
        style={{
          fontFamily: typography.family.extraBold,
          fontSize: typography.size['3xl'],
          color: colors.textPrimary,
        }}
        accessibilityLabel={`Rest timer: ${timeLabel}`}
      >
        {timeLabel}
      </Text>
      <Text
        style={{
          fontFamily: typography.family.regular,
          fontSize: typography.size.base,
          color: colors.textMuted,
        }}
      >
        REST
      </Text>
    </View>
  )
})
