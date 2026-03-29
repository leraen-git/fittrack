import React from 'react'
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  loading?: boolean
  disabled?: boolean
  accessibilityLabel?: string
  style?: ViewStyle
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { colors, typography, spacing, radius } = useTheme()

  const containerStyle: ViewStyle = {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    ...(variant === 'primary' && { backgroundColor: colors.primary }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
  }

  const textStyle: TextStyle = {
    fontFamily: typography.family.bold,
    fontSize: typography.size.body,
    color:
      variant === 'primary'
        ? tokenColors.white
        : variant === 'secondary'
          ? colors.primary
          : colors.textPrimary,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[containerStyle, style]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? tokenColors.white : colors.primary} />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}
