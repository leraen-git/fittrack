import React, { useRef, useCallback } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'

interface StepperProps {
  value: number
  min: number
  max: number
  step: number
  unit?: string
  formatValue?: (v: number) => string
  onChange: (v: number) => void
}

export function Stepper({
  value,
  min,
  max,
  step,
  unit,
  formatValue,
  onChange,
}: StepperProps) {
  const { tokens, fonts } = useTheme()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clamp = (v: number) => Math.round(Math.min(max, Math.max(min, v)) * 100) / 100

  const startRepeat = useCallback((delta: number) => {
    let interval = 200
    const tick = () => {
      onChange(clamp(value + delta))
      interval = Math.max(50, interval * 0.85)
      timerRef.current = setTimeout(tick, interval)
    }
    timerRef.current = setTimeout(tick, 500)
  }, [value, onChange, min, max])

  const stopRepeat = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const displayed = formatValue
    ? formatValue(value)
    : step < 1
      ? value.toFixed(1).replace('.', ',')
      : String(value)

  const btnStyle = (disabled: boolean) => ({
    width: 48,
    height: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: disabled ? tokens.border : tokens.borderStrong,
    opacity: disabled ? 0.3 : 1,
  })

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Pressable
        onPress={() => onChange(clamp(value - step))}
        onLongPress={() => startRepeat(-step)}
        onPressOut={stopRepeat}
        disabled={value <= min}
        style={btnStyle(value <= min)}
        accessibilityLabel="Decrease"
        accessibilityRole="button"
      >
        <Text style={{
          fontFamily: fonts.sansX,
          fontSize: 20,
          color: value <= min ? tokens.textGhost : tokens.text,
        }}>
          −
        </Text>
      </Pressable>

      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Text style={{
            fontFamily: fonts.monoB,
            fontSize: 32,
            color: tokens.text,
          }}>
            {displayed}
          </Text>
          {unit && (
            <Text style={{
              fontFamily: fonts.sansM,
              fontSize: 14,
              color: tokens.textMute,
            }}>
              {unit}
            </Text>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => onChange(clamp(value + step))}
        onLongPress={() => startRepeat(step)}
        onPressOut={stopRepeat}
        disabled={value >= max}
        style={btnStyle(value >= max)}
        accessibilityLabel="Increase"
        accessibilityRole="button"
      >
        <Text style={{
          fontFamily: fonts.sansX,
          fontSize: 20,
          color: value >= max ? tokens.textGhost : tokens.text,
        }}>
          +
        </Text>
      </Pressable>
    </View>
  )
}
