import React from 'react'
import { View, Text } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface SectionHeaderTemporalProps {
  label: string
  count: number
}

export const SectionHeaderTemporal = React.memo(function SectionHeaderTemporal({ label, count }: SectionHeaderTemporalProps) {
  const { tokens, fonts } = useTheme()

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: tokens.accent,
      paddingBottom: 6,
      marginTop: 16,
      marginBottom: 8,
    }}>
      <Text style={{
        fontFamily: fonts.sansB,
        fontSize: 10,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: tokens.accent,
      }}>
        {label}
      </Text>
      <Text style={{
        fontFamily: fonts.sansM,
        fontSize: 10,
        color: tokens.textMute,
      }}>
        {count}
      </Text>
    </View>
  )
})
