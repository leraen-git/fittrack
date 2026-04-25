import { useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { useDietGenerationStore } from '@/stores/dietGenerationStore'
import { useToastStore } from '@/stores/toastStore'
import { trpc } from '@/lib/trpc'
import { useInvalidateDiet } from '@/lib/invalidation'
import i18n from '@/i18n'

export function DietGenerationWatcher() {
  const { status, payload, finish, fail } = useDietGenerationStore()
  const toast = useToastStore()
  const invalidateDiet = useInvalidateDiet()
  const running = useRef(false)

  const submitMutation = trpc.diet.submitIntakeV2.useMutation()
  const regenMutation = trpc.diet.regeneratePlanV2.useMutation()

  useEffect(() => {
    if (status !== 'generating' || !payload || running.current) return
    running.current = true

    const run = async () => {
      try {
        if (payload.mode === 'submit' && payload.submitInput) {
          await submitMutation.mutateAsync(payload.submitInput as any)
        } else if (payload.mode === 'regenerate') {
          await regenMutation.mutateAsync({ useNewIntake: false })
        }
        invalidateDiet()
        finish()
        toast.show(i18n.t('diet.genReadyToast'), 'success', {
          duration: 5000,
          onPress: () => router.push('/diet'),
        })
      } catch (err: any) {
        const raw = err?.message ?? ''
        const msg = raw.includes('{') || raw.length > 100
          ? i18n.t('diet.genErrorToast')
          : raw || i18n.t('diet.genErrorToast')
        fail(msg)
        toast.show(msg, 'error', { duration: 5000 })
      } finally {
        running.current = false
      }
    }

    run()
  }, [status, payload])

  return null
}
