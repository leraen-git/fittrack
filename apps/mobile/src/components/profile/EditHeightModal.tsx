import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { BottomSheetShell } from '../BottomSheetShell'
import { Stepper } from '../Stepper'
import { Button } from '../Button'

interface Props {
  open: boolean
  onClose: () => void
  currentValue: number | null
  onSave: (value: number) => void
}

export function EditHeightModal({ open, onClose, currentValue, onSave }: Props) {
  const { t } = useTranslation()
  const { fonts, tokens } = useTheme()
  const [draft, setDraft] = useState(currentValue ?? 175)

  useEffect(() => {
    if (open) setDraft(currentValue ?? 175)
  }, [open])

  const handleSave = () => {
    onSave(draft)
    onClose()
  }

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      title={t('profile.editHeightTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      }
    >
      <Stepper
        value={draft}
        min={120}
        max={230}
        step={1}
        unit={t('profile.editHeightUnit')}
        onChange={setDraft}
      />
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: 12,
        color: tokens.textMute,
        marginTop: 12,
        textAlign: 'center',
      }}>
        {t('profile.editHeightHelper')}
      </Text>
    </BottomSheetShell>
  )
}
