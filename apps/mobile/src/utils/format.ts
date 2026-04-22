// ─── Number & unit formatting — fr-FR conventions ────────────────────────────
// Tanren is metric-only, France-first.
// - Decimal separator: comma in copy ("82,5 kg"), dot in inputs/code
// - Thousands separator: non-breaking space (fr-FR standard) → "12 450 kg"
// - Weights stored and passed as kg (Float)

const FR = 'fr-FR'

/** Format a weight value for display: "100 kg", "82,5 kg" */
export function formatWeight(kg: number): string {
  const formatted = Number.isInteger(kg)
    ? kg.toLocaleString(FR)
    : kg.toLocaleString(FR, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  return `${formatted} kg`
}

/** Format a volume/tonnage for display: "450 kg", "12 450 kg" */
export function formatVolume(kg: number): string {
  return `${Math.round(kg).toLocaleString(FR)} kg`
}

/** Format a rest or session duration */
export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem > 0 ? `${h}h${String(rem).padStart(2, '0')}` : `${h}h`
}

/** Format a percentage delta: "+4,2 %", "-1,5 %" */
export function formatDelta(ratio: number): string {
  const pct = ratio * 100
  const formatted = Math.abs(pct).toLocaleString(FR, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return pct >= 0 ? `+${formatted} %` : `-${formatted} %`
}
