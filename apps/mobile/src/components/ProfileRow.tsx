import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'

interface ProfileRowProps {
  label: string
  value?: string
  onPress?: () => void
  disabled?: boolean
  badge?: 'soon'
  danger?: boolean
  showChevron?: boolean
}

export function ProfileRow({
  label,
  value,
  onPress,
  disabled = false,
  badge,
  danger = false,
  showChevron = true,
}: ProfileRowProps) {
  const { tokens, fonts } = useTheme()
  const { t } = useTranslation()

  const content = (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: tokens.border,
    }}>
      <Text style={{
        flex: 1,
        fontFamily: fonts.sansM,
        fontSize: 14,
        color: danger ? tokens.accent : tokens.text,
        opacity: disabled ? 0.5 : 1,
      }}>
        {label}
      </Text>

      {badge === 'soon' && (
        <View style={{
          backgroundColor: tokens.surface2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          marginRight: 8,
        }}>
          <Text style={{
            fontFamily: fonts.sansB,
            fontSize: 9,
            letterSpacing: 1.8,
            textTransform: 'uppercase',
            color: tokens.textMute,
          }}>
            {t('profile.healthSoonBadge')}
          </Text>
        </View>
      )}

      {value && !badge && (
        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 14,
          color: tokens.textMute,
          marginRight: 8,
        }}>
          {value}
        </Text>
      )}

      {showChevron && !disabled && !badge && (
        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 16,
          color: tokens.textMute,
        }}>
          ›
        </Text>
      )}
    </View>
  )

  if (disabled || !onPress) {
    return <View>{content}</View>
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {content}
    </TouchableOpacity>
  )
}
