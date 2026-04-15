import React, { useState } from 'react'
import {
  Modal, View, Text, TouchableOpacity, TextInput,
  Dimensions, TouchableWithoutFeedback,
} from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'

interface Props {
  visible: boolean
  value: string  // 'HH:MM'
  onConfirm: (time: string) => void
  onClose: () => void
  label?: string
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function TimePickerModal({ visible, value, onConfirm, onClose, label }: Props) {
  const { colors, typography, spacing, radius } = useTheme()

  const [hour, minute] = value.split(':').map(Number)
  const [h, setH] = useState(pad(hour ?? 0))
  const [m, setM] = useState(pad(minute ?? 0))

  // Re-sync when `value` changes (e.g., external update)
  React.useEffect(() => {
    const [hh, mm] = value.split(':').map(Number)
    setH(pad(hh ?? 0))
    setM(pad(mm ?? 0))
  }, [value, visible])

  const adjustHour = (delta: number) => {
    const next = ((Number(h) + delta + 24) % 24)
    setH(pad(next))
  }

  const adjustMinute = (delta: number) => {
    let next = Number(m) + delta
    if (next >= 60) { next -= 60; adjustHour(1) }
    else if (next < 0) { next += 60; adjustHour(-1) }
    setM(pad(next))
  }

  const handleConfirm = () => {
    const hh = Math.min(23, Math.max(0, Number(h) || 0))
    const mm = Math.min(59, Math.max(0, Number(m) || 0))
    onConfirm(`${pad(hh)}:${pad(mm)}`)
    onClose()
  }

  const spinnerStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center' as const,
    width: 90,
    gap: spacing.sm,
  }

  const numberStyle = {
    fontFamily: typography.family.extraBold,
    fontSize: typography.size['3xl'],
    color: colors.textPrimary,
    textAlign: 'center' as const,
    minWidth: 60,
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: colors.background,
              borderTopLeftRadius: radius.xl,
              borderTopRightRadius: radius.xl,
              padding: spacing.lg,
              paddingBottom: spacing.xl,
              height: SCREEN_HEIGHT * 0.38,
            }}>
              {label && (
                <Text style={{
                  fontFamily: typography.family.semiBold,
                  fontSize: typography.size.base,
                  color: colors.textMuted,
                  textAlign: 'center',
                  marginBottom: spacing.lg,
                }}>
                  {label}
                </Text>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
                {/* Hour spinner */}
                <View style={spinnerStyle}>
                  <TouchableOpacity
                    onPress={() => adjustHour(1)}
                    accessibilityLabel="Increase hour" accessibilityRole="button"
                    style={{ padding: spacing.xs }}
                  >
                    <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.primary }}>▲</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={h}
                    onChangeText={(v) => setH(v.replace(/\D/g, '').slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={numberStyle}
                    selectTextOnFocus
                    accessibilityLabel="Hour"
                  />
                  <TouchableOpacity
                    onPress={() => adjustHour(-1)}
                    accessibilityLabel="Decrease hour" accessibilityRole="button"
                    style={{ padding: spacing.xs }}
                  >
                    <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.primary }}>▼</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ fontFamily: typography.family.extraBold, fontSize: typography.size['2xl'], color: colors.textPrimary }}>:</Text>

                {/* Minute spinner */}
                <View style={spinnerStyle}>
                  <TouchableOpacity
                    onPress={() => adjustMinute(5)}
                    accessibilityLabel="Increase minute" accessibilityRole="button"
                    style={{ padding: spacing.xs }}
                  >
                    <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.primary }}>▲</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={m}
                    onChangeText={(v) => setM(v.replace(/\D/g, '').slice(0, 2))}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={numberStyle}
                    selectTextOnFocus
                    accessibilityLabel="Minute"
                  />
                  <TouchableOpacity
                    onPress={() => adjustMinute(-5)}
                    accessibilityLabel="Decrease minute" accessibilityRole="button"
                    style={{ padding: spacing.xs }}
                  >
                    <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.xl, color: colors.primary }}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  marginTop: spacing.lg,
                  backgroundColor: colors.primary,
                  borderRadius: radius.lg,
                  paddingVertical: spacing.md,
                  alignItems: 'center',
                }}
                accessibilityLabel="Confirm time" accessibilityRole="button"
              >
                <Text style={{ fontFamily: typography.family.bold, fontSize: typography.size.body, color: tokenColors.white }}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
