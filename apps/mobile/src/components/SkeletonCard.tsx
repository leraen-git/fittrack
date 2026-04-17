import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface SkeletonCardProps {
  height?: number
  width?: number | string
}

export const SkeletonCard = React.memo(function SkeletonCard({ height = 80, width = '100%' }: SkeletonCardProps) {
  const { colors, radius } = useTheme()
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    )
    anim.start()
    return () => anim.stop()
  }, [opacity])

  return (
    <Animated.View
      accessible={false}
      style={{
        height,
        width: width as number,
        borderRadius: radius.lg,
        backgroundColor: colors.surface2,
        opacity,
      }}
    />
  )
})
