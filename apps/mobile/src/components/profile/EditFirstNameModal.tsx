import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { BottomSheetShell } from '../BottomSheetShell'
import { Input } from '../Input'
import { Button } from '../Button'

interface Props {
  open: boolean
  onClose: () => void
  currentValue: string
  onSave: (value: string) => void
}

export function EditFirstNameModal({ open, onClose, currentValue, onSave }: Props) {
  const { t } = useTranslation()
  const { tokens, fonts } = useTheme()
  const [draft, setDraft] = useState(currentValue)

  useEffect(() => {
    if (open) setDraft(currentValue)
  }, [open])

  const handleSave = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== currentValue) {
      onSave(trimmed)
    }
    onClose()
  }

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      title={t('profile.editFirstNameTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} disabled={!draft.trim()} style={{ flex: 1 }} />
        </View>
      }
    >
      <Input
        value={draft}
        onChangeText={setDraft}
        placeholder={t('profile.fieldNamePlaceholder')}
        autoFocus
        maxLength={40}
        returnKeyType="done"
        onSubmitEditing={handleSave}
        accessibilityLabel={t('profile.editFirstNameTitle')}
      />
      <Text style={{
        fontFamily: fonts.sans,
        fontSize: 12,
        color: tokens.textMute,
        marginTop: 8,
      }}>
        {t('profile.editFirstNameHelper')}
      </Text>
    </BottomSheetShell>
  )
}
