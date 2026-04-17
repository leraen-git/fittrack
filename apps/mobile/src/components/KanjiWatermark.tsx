import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  color: string
}

export function KanjiWatermark({ color }: Props) {
  return (
    <View
      style={styles.wrapper}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.inner}>
        <Text
          style={[styles.text, { color }]}
          numberOfLines={1}
          adjustsFontSizeToFit={false}
        >
          鍛錬
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    overflow: 'visible',
  },
  inner: {
    width: 700,
    alignItems: 'center',
    overflow: 'visible',
  },
  text: {
    fontFamily: 'NotoSerifJP_900Black_subset',
    fontSize: 320,
    lineHeight: 380,
    letterSpacing: -16,
    opacity: 0.045,
    includeFontPadding: false,
    textAlign: 'center',
  },
})
