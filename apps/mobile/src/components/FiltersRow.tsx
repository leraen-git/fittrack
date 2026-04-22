import React from 'react'
import { ScrollView, TouchableOpacity, Text, View } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface FilterOption<T extends string> {
  value: T
  label: string
}

interface FiltersRowProps<T extends string> {
  options: FilterOption<T>[]
  value: T
  onChange: (v: T) => void
  accentSelected?: boolean
  fullWidth?: boolean
}

export function FiltersRow<T extends string>({ options, value, onChange, accentSelected = false, fullWidth = false }: FiltersRowProps<T>) {
  const { tokens, fonts } = useTheme()

  const chips = options.map((opt) => {
    const selected = opt.value === value
    return (
      <TouchableOpacity
        key={opt.value}
        onPress={() => onChange(opt.value)}
        style={{
          flex: fullWidth ? 1 : undefined,
          height: 28,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: fullWidth ? 4 : 12,
          backgroundColor: selected
            ? accentSelected ? tokens.accent : `${tokens.accent}22`
            : 'transparent',
          borderWidth: 1,
          borderColor: selected
            ? tokens.accent
            : tokens.borderStrong,
        }}
        accessibilityLabel={opt.label}
        accessibilityRole="button"
      >
        <Text style={{
          fontFamily: fonts.sansB,
          fontSize: 10,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: selected
            ? accentSelected ? '#FFFFFF' : tokens.accent
            : tokens.textDim,
        }}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    )
  })

  if (fullWidth) {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 6, paddingVertical: 4 }}>
        {chips}
      </View>
    )
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingVertical: 4, alignItems: 'center' }}>
      {chips}
    </ScrollView>
  )
}
