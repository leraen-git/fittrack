import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { BottomSheetShell } from '../BottomSheetShell'
import { Stepper } from '../Stepper'
import { Button } from '../Button'
import { QuickSetButton } from './QuickSetButton'

interface Props {
  open: boolean
  onClose: () => void
  lastWeightKg: number | null
  onSave: (weightKg: number, measuredAt: string) => void
}

export function AddWeightModal({ open, onClose, lastWeightKg, onSave }: Props) {
  const { t } = useTranslation()
  const { tokens, fonts } = useTheme()
  const [weight, setWeight] = useState(lastWeightKg ?? 75)

  useEffect(() => {
    if (open) setWeight(lastWeightKg ?? 75)
  }, [open])

  const handleSave = () => {
    onSave(weight, new Date().toISOString())
    onClose()
  }

  const quickButtons = [
    { label: '−1', delta: -1 },
    { label: '−0,5', delta: -0.5 },
    { label: '−0,1', delta: -0.1 },
    { label: '+0,1', delta: 0.1 },
    { label: '+0,5', delta: 0.5 },
    { label: '+1', delta: 1 },
  ]

  const now = new Date()
  const dateStr = `Aujourd'hui · ${now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      title={t('profile.addWeightTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      }
    >
      <Stepper
        value={weight}
        min={30}
        max={300}
        step={0.1}
        unit={t('profile.addWeightUnit')}
        onChange={setWeight}
      />

      <Text style={{
        fontFamily: fonts.sans,
        fontSize: 11,
        color: tokens.textMute,
        textAlign: 'center',
        marginTop: 6,
      }}>
        {t('profile.addWeightHelper')}
      </Text>

      {/* Quick-set buttons */}
      <View style={{ marginTop: 16, gap: 6 }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {quickButtons.slice(0, 3).map((btn) => (
            <QuickSetButton
              key={btn.label}
              label={btn.label}
              onPress={() => setWeight(Math.round(Math.max(30, Math.min(300, weight + btn.delta)) * 10) / 10)}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {quickButtons.slice(3).map((btn) => (
            <QuickSetButton
              key={btn.label}
              label={btn.label}
              onPress={() => setWeight(Math.round(Math.max(30, Math.min(300, weight + btn.delta)) * 10) / 10)}
            />
          ))}
        </View>
      </View>

      {/* Date row */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: tokens.border,
      }}>
        <Text style={{ fontFamily: fonts.sansM, fontSize: 12, color: tokens.textMute }}>
          Date
        </Text>
        <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.text, marginLeft: 'auto' }}>
          {dateStr}
        </Text>
      </View>
    </BottomSheetShell>
  )
}
