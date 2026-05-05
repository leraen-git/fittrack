import React, { useMemo, useRef, useEffect } from 'react'
import { View, Text, ScrollView, Dimensions } from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { colors as tokenColors } from '@/theme/tokens'
import { useTranslation } from 'react-i18next'
import { formatMonthLabel } from '@/utils/format'
import type { HeatmapCell } from '@tanren/shared'

const CELL_GAP = 3
const DAY_LABEL_WIDTH = 18
const SCREEN_WIDTH = Dimensions.get('window').width
const GRID_PADDING = 32
const MAX_WEEKS = 20
const CELL_SIZE = Math.floor(
  (SCREEN_WIDTH - GRID_PADDING - DAY_LABEL_WIDTH - 4 - MAX_WEEKS * CELL_GAP) / MAX_WEEKS
)
const HEATMAP = tokenColors.heatmap

const DAY_LABELS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const DAY_LABELS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function levelColor(level: number): string {
  return HEATMAP[Math.min(level, 4)] ?? HEATMAP[0]
}

interface HistoryHeatmapProps {
  cells: HeatmapCell[]
  startDate: string
}

export const HistoryHeatmap = React.memo(function HistoryHeatmap({ cells, startDate }: HistoryHeatmapProps) {
  const { tokens, fonts } = useTheme()
  const { t, i18n } = useTranslation()
  const isFr = i18n.language === 'fr'
  const dayLabels = isFr ? DAY_LABELS_FR : DAY_LABELS_EN
  const scrollRef = useRef<ScrollView>(null)

  const { grid, monthLabels } = useMemo(() => {
    const cellMap = new Map<string, HeatmapCell>()
    for (const c of cells) cellMap.set(c.date, c)

    const start = new Date(startDate + 'T00:00:00')
    const weeks: HeatmapCell[][] = []
    let currentWeek: HeatmapCell[] = []
    const cursor = new Date(start)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    while (cursor <= today) {
      const dateStr = cursor.toISOString().slice(0, 10)
      const dayIdx = (cursor.getDay() + 6) % 7
      if (dayIdx === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(cellMap.get(dateStr) ?? { date: dateStr, volume: 0, level: 0 })
      cursor.setDate(cursor.getDate() + 1)
    }
    if (currentWeek.length > 0) weeks.push(currentWeek)

    // Reverse: most recent week first
    weeks.reverse()

    const months: Array<{ label: string; weekIdx: number }> = []
    let lastMonth = -1
    for (let w = 0; w < weeks.length; w++) {
      const firstCell = weeks[w]?.[0]
      if (!firstCell) continue
      const d = new Date(firstCell.date + 'T00:00:00')
      const m = d.getMonth()
      if (m !== lastMonth) {
        const label = formatMonthLabel(d)
        months.push({ label: label.charAt(0).toUpperCase() + label.slice(1), weekIdx: w })
        lastMonth = m
      }
    }

    return { grid: weeks, monthLabels: months }
  }, [cells, startDate, isFr])

  const dayLabelWidth = DAY_LABEL_WIDTH

  const gridContent = (
    <View>
      {/* Month labels */}
      <View style={{ flexDirection: 'row', marginLeft: dayLabelWidth + 4, height: 16, marginBottom: 3 }}>
        {monthLabels.map((m, i) => (
          <Text
            key={i}
            style={{
              position: 'absolute',
              left: m.weekIdx * (CELL_SIZE + CELL_GAP),
              fontFamily: fonts.sansB,
              fontSize: 9,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              color: tokens.textGhost,
            }}
          >
            {m.label}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row' }}>
        {/* Day labels */}
        <View style={{ justifyContent: 'space-between', marginRight: 4, paddingVertical: 1 }}>
          {dayLabels.map((d, i) => (
            <Text
              key={i}
              style={{
                fontFamily: fonts.sansB,
                fontSize: 8,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: tokens.textGhost,
                height: CELL_SIZE,
                lineHeight: CELL_SIZE,
                textAlign: 'right',
                width: dayLabelWidth,
              }}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View style={{ flexDirection: 'row', gap: CELL_GAP }}>
          {grid.map((week, wi) => (
            <View key={wi} style={{ gap: CELL_GAP }}>
              {week.map((cell, di) => (
                <View
                  key={di}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: levelColor(cell.level),
                  }}
                  accessibilityLabel={`${cell.date}: ${Math.round(cell.volume)} kg`}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginLeft: 20 }}>
        <Text style={{ fontFamily: fonts.sansM, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase', color: tokens.textMute }}>{t('history.heatmapLegendLess')}</Text>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          {HEATMAP.map((c, i) => (
            <View key={i} style={{ width: 12, height: 12, backgroundColor: c }} />
          ))}
        </View>
        <Text style={{ fontFamily: fonts.sansM, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase', color: tokens.textMute }}>{t('history.heatmapLegendMore')}</Text>
      </View>
    </View>
  )

  if (grid.length <= 20) return gridContent

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {gridContent}
    </ScrollView>
  )
})
