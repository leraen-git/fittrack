import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'
import { Button } from '@/components/Button'
import { trpc } from '@/lib/trpc'
import { useProfile } from '@/data/useProfile'
import { useAIPlanStore } from '@/stores/aiPlanStore'
import { useTranslation } from 'react-i18next'
import { formatDateDayMonthLong } from '@/utils/format'

const SUGGESTIONS = [
  { titleKey: 'ai.suggestionPpl', descKey: 'ai.suggestionPplDesc', promptKey: 'ai.suggestionPplPrompt' },
  { titleKey: 'ai.suggestionUpperLower', descKey: 'ai.suggestionUpperLowerDesc', promptKey: 'ai.suggestionUpperLowerPrompt' },
  { titleKey: 'ai.suggestionFullBody', descKey: 'ai.suggestionFullBodyDesc', promptKey: 'ai.suggestionFullBodyPrompt' },
] as const

export default function GeneratePlanScreen() {
  const { tokens, fonts, label } = useTheme()
  const { t } = useTranslation()
  const { data: user } = useProfile()
  const { data: credits } = trpc.plans.aiCredits.useQuery()
  const { conversationHistory, lastPrompt, setPendingPrompt, reset } = useAIPlanStore()
  const isRefinement = conversationHistory.length > 0
  const [prompt, setPrompt] = useState(isRefinement ? '' : lastPrompt)

  const GOAL_LABELS: Record<string, string> = {
    MUSCLE_GAIN: t('profile.goalMuscleGain'),
    WEIGHT_LOSS: t('profile.goalWeightLoss'),
    MAINTENANCE: t('profile.goalMaintenance'),
  }

  const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: t('profile.levelBeginner'),
    INTERMEDIATE: t('profile.levelIntermediate'),
    ADVANCED: t('profile.levelAdvanced'),
  }

  const remaining = credits ? credits.limit - credits.used : 1

  const handleGenerate = () => {
    if (remaining <= 0) {
      Alert.alert(t('ai.noCreditsTitle'), t('ai.noCreditsDesc'))
      return
    }
    const trimmed = prompt.trim()
    if (!trimmed) {
      Alert.alert(t('generate.alertTitle'), t('generate.alertDesc'))
      return
    }
    setPendingPrompt(trimmed)
    router.push('/plans/generating')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => { reset(); router.back() }}
            accessibilityLabel={t('common.back')}
            accessibilityRole="button"
          >
            <Text style={{ ...label.md, color: tokens.accent }}>
              {'< '}{t('common.back').toUpperCase()}
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <View style={{
            borderWidth: 1,
            borderColor: tokens.accent,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}>
            <Text style={{ fontFamily: fonts.sansB, fontSize: 9, color: tokens.accent, letterSpacing: 1.4 }}>AI</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero */}
          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.sansX, fontSize: 24, color: tokens.text, textTransform: 'uppercase' }}>
              {isRefinement ? t('ai.heroTitleRefine') : t('ai.heroTitleInitial')}
            </Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: tokens.textMute }}>
              {isRefinement ? t('ai.heroDescRefine') : t('ai.heroDescInitial')}
            </Text>
          </View>

          {/* Credits counter */}
          {credits && (
            <View style={{ borderWidth: 1, borderColor: tokens.border, borderTopWidth: 3, borderTopColor: tokens.accent, padding: 12, gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ ...label.sm, color: tokens.textMute }}>
                  {t('ai.creditsLabel')}
                </Text>
                <Text style={{ fontFamily: fonts.monoB, fontSize: 20 }}>
                  <Text style={{ color: (credits.limit - credits.used) > 0 ? tokens.text : tokens.accent }}>{credits.limit - credits.used}</Text>
                  <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: tokens.textMute }}> / {credits.limit}</Text>
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 2, height: 3 }}>
                {Array.from({ length: credits.limit }).map((_, i) => (
                  <View key={i} style={{
                    flex: 1, height: 3,
                    backgroundColor: i < credits.used ? tokens.accent : tokens.surface2,
                  }} />
                ))}
              </View>
              <Text style={{ fontFamily: fonts.sans, fontSize: 10, color: tokens.textMute }}>
                {t('ai.creditsReset')} <Text style={{ fontFamily: fonts.monoB, color: tokens.text }}>{formatDateDayMonthLong(new Date(credits.resetAt))}</Text>
              </Text>
            </View>
          )}

          {/* Profile chips */}
          {user && (
            <View style={{ gap: 8 }}>
              <Text style={{ ...label.sm, color: tokens.textMute }}>
                {t('ai.profile').toUpperCase()}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {[
                  LEVEL_LABELS[user.level] ?? user.level,
                  GOAL_LABELS[user.goal] ?? user.goal,
                  `${user.weeklyTarget}× ${t('ai.perWeek')}`,
                  ...(user.weightKg ? [`${user.weightKg} kg`] : []),
                  ...(user.heightCm ? [`${user.heightCm} cm`] : []),
                ].map((chip) => (
                  <View
                    key={chip}
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: tokens.accent,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.sansB, fontSize: 10, color: tokens.accent, letterSpacing: 1 }}>
                      {chip.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Conversation history */}
          {isRefinement && conversationHistory.length > 0 && (
            <View style={{ gap: 8 }}>
              {conversationHistory.map((msg, i) => (
                <View key={i} style={{ gap: 2 }}>
                  <Text style={{ ...label.sm, color: msg.role === 'user' ? tokens.accent : tokens.textMute }}>
                    {msg.role === 'user' ? t('ai.conversationToi') : t('ai.conversationIa')}
                  </Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.textDim }} numberOfLines={3}>
                    {msg.content}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Prompt input */}
          <View style={{ gap: 8 }}>
            <Text style={{ ...label.md, color: tokens.textMute }}>
              {isRefinement ? t('ai.adjustments').toUpperCase() : t('ai.request').toUpperCase()}
            </Text>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder={isRefinement ? t('ai.promptPlaceholderRefine') : t('ai.promptPlaceholderInitial')}
              placeholderTextColor={tokens.textGhost}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{
                backgroundColor: tokens.surface1,
                padding: 12,
                color: tokens.text,
                fontFamily: fonts.sans,
                fontSize: 14,
                minHeight: 120,
                borderWidth: 1,
                borderColor: tokens.border,
              }}
              accessibilityLabel={t('ai.request')}
            />
          </View>

          {/* Suggestions */}
          {!isRefinement && (
            <View style={{ gap: 8 }}>
              <Text style={{ ...label.sm, color: tokens.textMute }}>
                {t('ai.suggestions').toUpperCase()}
              </Text>
              <View style={{ gap: 0 }}>
                {SUGGESTIONS.map((s, i) => (
                  <TouchableOpacity
                    key={s.titleKey}
                    onPress={() => setPrompt(t(s.promptKey))}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: tokens.border,
                      borderTopWidth: i === 0 ? 1 : 0,
                      borderTopColor: tokens.border,
                      gap: 2,
                    }}
                    accessibilityLabel={t(s.titleKey)}
                    accessibilityRole="button"
                  >
                    <Text style={{ fontFamily: fonts.sansB, fontSize: 13, color: tokens.text, textTransform: 'uppercase' }}>
                      {t(s.titleKey)}
                    </Text>
                    <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: tokens.textMute }}>
                      {t(s.descKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Button
            label={isRefinement ? t('ai.refine') : t('ai.generate')}
            onPress={handleGenerate}
            disabled={remaining <= 0}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
