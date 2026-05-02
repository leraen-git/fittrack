import type { SessionListItem } from '@tanren/shared'
import { getLocaleTag } from './format'

export interface SessionGroup {
  key: string
  label: string
  count: number
  sessions: SessionListItem[]
}

export function groupSessionsByTime(
  sessions: SessionListItem[],
  locale: 'fr' | 'en' = 'fr',
  now: Date = new Date(),
): SessionGroup[] {
  const groups = new Map<string, SessionGroup>()

  const startOfThisWeek = new Date(now)
  startOfThisWeek.setHours(0, 0, 0, 0)
  const dayOfWeek = (startOfThisWeek.getDay() + 6) % 7 // Mon=0
  startOfThisWeek.setDate(startOfThisWeek.getDate() - dayOfWeek)

  const labels = {
    fr: {
      thisWeek: 'Cette semaine',
      lastWeek: 'Semaine dernière',
      weeksAgo: (n: number) => `Il y a ${n} semaines`,
    },
    en: {
      thisWeek: 'This week',
      lastWeek: 'Last week',
      weeksAgo: (n: number) => `${n} weeks ago`,
    },
  }

  const l = labels[locale]

  for (const s of sessions) {
    const d = new Date(s.startedAt)
    let key: string
    let label: string

    if (d >= startOfThisWeek) {
      key = 'week-0'
      label = l.thisWeek
    } else {
      const diffMs = startOfThisWeek.getTime() - d.getTime()
      const weeksAgo = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1

      if (weeksAgo === 1) {
        key = 'week-1'
        label = l.lastWeek
      } else if (weeksAgo <= 3) {
        key = `week-${weeksAgo}`
        label = l.weeksAgo(weeksAgo)
      } else {
        const month = d.toLocaleDateString(getLocaleTag(), { month: 'long', year: 'numeric' })
        key = `month-${d.getFullYear()}-${d.getMonth()}`
        label = month.charAt(0).toUpperCase() + month.slice(1)
      }
    }

    const existing = groups.get(key)
    if (existing) {
      existing.sessions.push(s)
      existing.count++
    } else {
      groups.set(key, { key, label, count: 1, sessions: [s] })
    }
  }

  return Array.from(groups.values())
}
