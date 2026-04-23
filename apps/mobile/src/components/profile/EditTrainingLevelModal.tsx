import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { BottomSheetShell } from '../BottomSheetShell'
import { RadioItem } from '../RadioItem'
import { Button } from '../Button'
import type { UserLevel } from '@tanren/shared'

const LEVELS: { value: UserLevel; labelKey: string; descKey: string }[] = [
  { value: 'BEGINNER', labelKey: 'profile.levelBeginnerLabel', descKey: 'profile.levelBeginnerDesc' },
  { value: 'INTERMEDIATE', labelKey: 'profile.levelIntermediateLabel', descKey: 'profile.levelIntermediateDesc' },
  { value: 'ADVANCED', labelKey: 'profile.levelAdvancedLabel', descKey: 'profile.levelAdvancedDesc' },
]

interface Props {
  open: boolean
  onClose: () => void
  currentValue: UserLevel
  onSave: (value: UserLevel) => void
}

export function EditTrainingLevelModal({ open, onClose, currentValue, onSave }: Props) {
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
      title={t('profile.editLevelTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      }
    >
      {LEVELS.map((level) => (
        <RadioItem
          key={level.value}
          label={t(level.labelKey)}
          description={t(level.descKey)}
          selected={draft === level.value}
          onPress={() => setDraft(level.value)}
        />
      ))}
    </BottomSheetShell>
  )
}
