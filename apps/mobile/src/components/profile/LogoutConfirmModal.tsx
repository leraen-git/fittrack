import React, { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '../Button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutConfirmModal({ open, onClose, onConfirm }: Props) {
  const { t } = useTranslation()
  const { tokens, fonts } = useTheme()
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  useEffect(() => {
    if (open) {
      opacity.value = withTiming(1, { duration: 200 })
      scale.value = withTiming(1, { duration: 200 })
    } else {
      opacity.value = withTiming(0, { duration: 150 })
      scale.value = withTiming(0.9, { duration: 150 })
    }
  }, [open])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0, 0.72], Extrapolation.CLAMP),
  }))

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={onClose}
      >
        <Animated.View style={[{ flex: 1, backgroundColor: '#000000' }, backdropStyle]} />
      </Pressable>

      <Animated.View style={[{
        marginHorizontal: 30,
        backgroundColor: tokens.surface1,
        borderWidth: 1,
        borderColor: tokens.border,
        padding: 28,
        width: '100%',
        maxWidth: 340,
      }, modalStyle]}>
        {/* Stamp */}
        <Text style={{
          fontFamily: fonts.jp,
          fontSize: 10,
          letterSpacing: 4,
          color: tokens.accent,
          textAlign: 'center',
          marginBottom: 16,
        }}>
          鍛 錬
        </Text>

        {/* Title */}
        <Text style={{
          fontFamily: fonts.sansX,
          fontSize: 20,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: tokens.text,
          textAlign: 'center',
          marginBottom: 12,
        }}>
          {t('profile.logoutConfirmTitle')}
        </Text>

        {/* Description */}
        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 12,
          color: tokens.textDim,
          lineHeight: 18,
          textAlign: 'center',
          marginBottom: 24,
        }}>
          {t('profile.logoutConfirmDesc')}
        </Text>

        {/* Actions */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            label={t('profile.logoutConfirmCancel')}
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            label={t('profile.logoutConfirmAction')}
            variant="danger"
            onPress={onConfirm}
            style={{ flex: 1 }}
          />
        </View>
      </Animated.View>
    </View>
  )
}
