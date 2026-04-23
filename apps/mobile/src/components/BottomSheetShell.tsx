import React, { useEffect } from 'react'
import { View, Text, Pressable, Dimensions, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/theme/ThemeContext'

const SCREEN_HEIGHT = Dimensions.get('window').height
const DISMISS_THRESHOLD = 100

interface BottomSheetShellProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function BottomSheetShell({
  open,
  onClose,
  title,
  children,
  actions,
}: BottomSheetShellProps) {
  const { tokens, fonts } = useTheme()
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(SCREEN_HEIGHT)
  const backdropOpacity = useSharedValue(0)

  useEffect(() => {
    if (open) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
      backdropOpacity.value = withTiming(1, { duration: 200 })
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 })
      backdropOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [open])

  const dismiss = () => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 })
    backdropOpacity.value = withTiming(0, { duration: 200 })
    setTimeout(onClose, 260)
  }

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD || e.velocityY > 800) {
        runOnJS(dismiss)()
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      backdropOpacity.value,
      [0, 1],
      [0, 0.72],
      Extrapolation.CLAMP,
    ),
  }))

  if (!open) return null

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
    }}>
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={dismiss}
      >
        <Animated.View style={[
          { flex: 1, backgroundColor: '#000000' },
          backdropStyle,
        ]} />
      </Pressable>

      <GestureDetector gesture={pan}>
        <Animated.View style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: tokens.surface1,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingBottom: insets.bottom + 16,
          } satisfies ViewStyle,
          sheetStyle,
        ]}>
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 16 }}>
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: tokens.borderStrong,
              borderRadius: 2,
            }} />
          </View>

          {/* Title */}
          <Text style={{
            fontFamily: fonts.sansX,
            fontSize: 17,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: tokens.text,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            {title}
          </Text>

          {/* Content */}
          <View style={{ paddingHorizontal: 24 }}>
            {children}
          </View>

          {/* Actions */}
          {actions && (
            <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
              {actions}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
