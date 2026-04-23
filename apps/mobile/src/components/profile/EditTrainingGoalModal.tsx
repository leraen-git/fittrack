import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { BottomSheetShell } from '../BottomSheetShell'
import { RadioItem } from '../RadioItem'
import { Button } from '../Button'
import type { UserGoal } from '@tanren/shared'

const GOALS: { value: UserGoal; labelKey: string; descKey: string }[] = [
  { value: 'MUSCLE_GAIN', labelKey: 'profile.goalMuscleLabel', descKey: 'profile.goalMuscleDesc' },
  { value: 'WEIGHT_LOSS', labelKey: 'profile.goalFatLossLabel', descKey: 'profile.goalFatLossDesc' },
  { value: 'MAINTENANCE', labelKey: 'profile.goalMaintenanceLabel', descKey: 'profile.goalMaintenanceDesc' },
]

interface Props {
  open: boolean
  onClose: () => void
  currentValue: UserGoal
  onSave: (value: UserGoal) => void
}

export function EditTrainingGoalModal({ open, onClose, currentValue, onSave }: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(currentValue)

  useEffect(() => {
    if (open) setDraft(currentValue)
  }, [open])

  const handleSave = () => {
    if (draft !== currentValue) onSave(draft)
    onClose()
  }

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      title={t('profile.editGoalTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      }
    >
      {GOALS.map((goal) => (
        <RadioItem
          key={goal.value}
          label={t(goal.labelKey)}
          description={t(goal.descKey)}
          selected={draft === goal.value}
          onPress={() => setDraft(goal.value)}
        />
      ))}
    </BottomSheetShell>
  )
}
