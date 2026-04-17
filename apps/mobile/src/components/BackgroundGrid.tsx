import React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'

const CELL = 24

interface Props {
  color: string
}

export function BackgroundGrid({ color }: Props) {
  const { width, height } = useWindowDimensions()
  const cols = Math.ceil(width / CELL) + 1
  const rows = Math.ceil(height / CELL) + 1

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: cols }).map((_, i) => (
        <View key={`v${i}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: i * CELL, width: 1, backgroundColor: color,
        }} />
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`h${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: i * CELL, height: 1, backgroundColor: color,
        }} />
      ))}
    </View>
  )
}
