import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/theme/ThemeContext'
import { BottomSheetShell } from '../BottomSheetShell'
import { Stepper } from '../Stepper'
import { Button } from '../Button'

function getCoachingTip(n: number): { title: string; description: string } {
  if (n === 2) return { title: '2 séances/sem', description: 'Minimum pour progresser. Idéal en Full Body — chaque séance touche tout le corps.' }
  if (n === 3) return { title: '3 séances/sem', description: 'Très bon volume. Full Body ou Push/Pull/Legs alterné une semaine sur deux.' }
  if (n === 4) return { title: '4 séances/sem', description: "Idéal pour l'hypertrophie en split Push/Pull/Legs/Upper." }
  if (n === 5) return { title: '5 séances/sem', description: 'Volume élevé. Bro split (1 muscle/jour) ou PPL+Upper/Lower.' }
  if (n === 6) return { title: '6 séances/sem', description: 'PPL classique × 2. Demande une bonne récupération et nutrition.' }
  if (n === 7) return { title: '7 séances/sem', description: 'Niveau avancé. Volume très élevé, repose sur un programme bien construit.' }
  return { title: '', description: '' }
}

interface Props {
  open: boolean
  onClose: () => void
  currentValue: number
  onSave: (value: number) => void
}

export function EditSessionsPerWeekModal({ open, onClose, currentValue, onSave }: Props) {
  const { t } = useTranslation()
  const { tokens, fonts } = useTheme()
  const [draft, setDraft] = useState(currentValue)

  useEffect(() => {
    if (open) setDraft(currentValue)
  }, [open])

  const handleSave = () => {
    if (draft !== currentValue) onSave(draft)
    onClose()
  }

  const tip = getCoachingTip(draft)

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      title={t('profile.editSessionsTitle')}
      actions={
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label={t('common.cancel')} variant="outline" onPress={onClose} style={{ flex: 1 }} />
          <Button label={t('profile.actionSave')} variant="primary" onPress={handleSave} style={{ flex: 1 }} />
        </View>
      }
    >
      <Stepper
        value={draft}
        min={2}
        max={7}
        step={1}
        unit={t('profile.editSessionsUnit')}
        onChange={setDraft}
      />

      {tip.title ? (
        <View style={{
          borderWidth: 1,
          borderColor: tokens.accent,
          borderStyle: 'dashed',
          padding: 12,
          marginTop: 20,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          <Text style={{ fontFamily: fonts.jp, fontSize: 18, color: tokens.accent }}>
            鍛
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: fonts.sansB,
              fontSize: 12,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: tokens.accent,
            }}>
              {tip.title}
            </Text>
            <Text style={{
              fontFamily: fonts.sans,
              fontSize: 12,
              color: tokens.textDim,
              marginTop: 4,
              lineHeight: 17,
            }}>
              {tip.description}
            </Text>
          </View>
        </View>
      ) : null}
    </BottomSheetShell>
  )
}
