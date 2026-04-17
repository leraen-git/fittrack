import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

const RED = '#E8192C'
const BG = '#000000'
const WHITE = '#FFFFFF'
const GREY = '#888888'
const GRID = '#1A1A1A'

// ─── Forge-Spark Mark ────────────────────────────────────────────────────────
// Geometric interpretation of the SVG mark (200×200 viewBox scaled to 140×140).

interface MarkProps {
  size?: number
  isDark?: boolean
}

function ForgeMark({ size = 140, isDark = true }: MarkProps) {
  const s = size / 200           // scale factor
  const c = size / 2             // center

  const ringR = Math.round(72 * s)
  const ringStroke = Math.round(6 * s)
  const coreR = Math.round(14 * s)

  const barW = Math.round(16 * s)
  const barH = Math.round(50 * s)
  const barEdge = Math.round(20 * s)  // distance from edge to bar start

  const sparkLen = Math.round(Math.sqrt(2) * 13 * s)
  const sparkH = Math.max(2, Math.round(4 * s))

  // Spark centers in scaled coords (from SVG midpoints)
  const spark1 = { x: Math.round(141.5 * s), y: Math.round(58.5 * s) }
  const spark2 = { x: Math.round(58.5 * s),  y: Math.round(141.5 * s) }

  const ringColor = isDark ? WHITE : '#000000'
  const barsColor = isDark ? WHITE : '#000000'
  const coreColor = RED

  return (
    <View style={{ width: size, height: size }}>
      {/* Outer ring (anvil) */}
      <View style={{
        position: 'absolute',
        width: ringR * 2, height: ringR * 2,
        borderRadius: ringR,
        borderWidth: ringStroke,
        borderColor: ringColor,
        left: c - ringR, top: c - ringR,
      }} />

      {/* Vertical top bar */}
      <View style={{
        position: 'absolute',
        width: barW, height: barH,
        backgroundColor: barsColor,
        left: c - barW / 2, top: barEdge,
      }} />

      {/* Vertical bottom bar */}
      <View style={{
        position: 'absolute',
        width: barW, height: barH,
        backgroundColor: barsColor,
        left: c - barW / 2, top: size - barEdge - barH,
      }} />

      {/* Horizontal left bar */}
      <View style={{
        position: 'absolute',
        height: barW, width: barH,
        backgroundColor: barsColor,
        top: c - barW / 2, left: barEdge,
      }} />

      {/* Horizontal right bar */}
      <View style={{
        position: 'absolute',
        height: barW, width: barH,
        backgroundColor: barsColor,
        top: c - barW / 2, left: size - barEdge - barH,
      }} />

      {/* Inner core (heated steel) */}
      <View style={{
        position: 'absolute',
        width: coreR * 2, height: coreR * 2,
        borderRadius: coreR,
        backgroundColor: coreColor,
        left: c - coreR, top: c - coreR,
      }} />

      {/* Diagonal spark — top-right */}
      <View style={{
        position: 'absolute',
        width: sparkLen, height: sparkH,
        backgroundColor: RED,
        left: spark1.x - sparkLen / 2,
        top: spark1.y - sparkH / 2,
        transform: [{ rotate: '45deg' }],
      }} />

      {/* Diagonal spark — bottom-left */}
      <View style={{
        position: 'absolute',
        width: sparkLen, height: sparkH,
        backgroundColor: RED,
        left: spark2.x - sparkLen / 2,
        top: spark2.y - sparkH / 2,
        transform: [{ rotate: '45deg' }],
      }} />
    </View>
  )
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

interface Props {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: Props) {
  const containerOpacity = useSharedValue(1)
  const markOpacity      = useSharedValue(0)
  const markScale        = useSharedValue(0.8)
  const wordOpacity      = useSharedValue(0)
  const wordY            = useSharedValue(10)
  const kanjiOpacity     = useSharedValue(0)
  const motoOpacity      = useSharedValue(0)
  const glowScale        = useSharedValue(1)
  const glowOpacity      = useSharedValue(0.6)
  const loaderOpacity    = useSharedValue(0)
  const loaderWidth      = useSharedValue(0)

  useEffect(() => {
    const ease = Easing.out(Easing.exp)

    // Glow pulse
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1,    { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      ), -1, false,
    )
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 1600 }), withTiming(0.7, { duration: 1600 })),
      -1, false,
    )

    // Mark entrance
    markOpacity.value = withDelay(200, withTiming(1, { duration: 500, easing: ease }))
    markScale.value   = withDelay(200, withTiming(1, { duration: 500, easing: ease }))

    // Wordmark
    wordOpacity.value = withDelay(500, withTiming(1, { duration: 500, easing: ease }))
    wordY.value       = withDelay(500, withTiming(0, { duration: 500, easing: ease }))

    // Kanji + moto
    kanjiOpacity.value = withDelay(750, withTiming(1, { duration: 400 }))
    motoOpacity.value  = withDelay(950, withTiming(1, { duration: 400 }))

    // Loader
    loaderOpacity.value = withDelay(900,  withTiming(1, { duration: 300 }))
    loaderWidth.value   = withDelay(1000, withTiming(1, {
      duration: 1600,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }))

    // Fade out and finish
    containerOpacity.value = withDelay(3200, withTiming(0, { duration: 400 }, (done) => {
      if (done) runOnJS(onFinish)()
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }))
  const markStyle      = useAnimatedStyle(() => ({ opacity: markOpacity.value, transform: [{ scale: markScale.value }] }))
  const wordStyle      = useAnimatedStyle(() => ({ opacity: wordOpacity.value, transform: [{ translateY: wordY.value }] }))
  const kanjiStyle     = useAnimatedStyle(() => ({ opacity: kanjiOpacity.value }))
  const motoStyle      = useAnimatedStyle(() => ({ opacity: motoOpacity.value }))
  const glowStyle      = useAnimatedStyle(() => ({ transform: [{ scale: glowScale.value }], opacity: glowOpacity.value }))
  const loaderWrapStyle = useAnimatedStyle(() => ({ opacity: loaderOpacity.value }))
  const loaderBarStyle  = useAnimatedStyle(() => ({ width: `${loaderWidth.value * 100}%` as any }))

  return (
    <Animated.View style={[styles.root, containerStyle]}>

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Corners */}
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      {/* Center content */}
      <View style={styles.center}>

        {/* Red glow behind mark */}
        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Forge-Spark mark */}
        <Animated.View style={markStyle}>
          <ForgeMark size={140} isDark />
        </Animated.View>

        {/* Wordmark — TANREN */}
        <Animated.Text style={[styles.wordmark, wordStyle]}>
          TANREN
        </Animated.Text>

        {/* Kanji stamp */}
        <Animated.Text style={[styles.kanji, kanjiStyle]}>
          鍛錬
        </Animated.Text>

        {/* Moto — italic red */}
        <Animated.Text style={[styles.moto, motoStyle]}>
          Built rep by rep.
        </Animated.Text>

      </View>

      {/* Loader bar */}
      <Animated.View style={[styles.loaderWrap, loaderWrapStyle]}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderBar, loaderBarStyle]} />
        </View>
      </Animated.View>

      {/* Baseline — anchored at bottom */}
      <View style={styles.baseline}>
        <Text style={styles.baselineText}>EAT.{'  '}TRAIN.{'  '}REST.</Text>
      </View>

    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    // Simulated grid via border — repeated pattern would require a library.
    // Subtle dark surface behind content.
    opacity: 0.4,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(232,25,44,0.22)',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: GRID,
  },
  cornerTL: { top: '10%', left: '8%', borderTopWidth: 1, borderLeftWidth: 1 },
  cornerTR: { top: '10%', right: '8%', borderTopWidth: 1, borderRightWidth: 1 },
  cornerBL: { bottom: '10%', left: '8%', borderBottomWidth: 1, borderLeftWidth: 1 },
  cornerBR: { bottom: '10%', right: '8%', borderBottomWidth: 1, borderRightWidth: 1 },
  center: {
    alignItems: 'center',
    zIndex: 2,
  },
  wordmark: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 68,
    color: WHITE,
    letterSpacing: 10,
    marginTop: 20,
    lineHeight: 72,
    textTransform: 'uppercase',
  },
  kanji: {
    fontSize: 18,
    color: RED,
    letterSpacing: 8,
    marginTop: 6,
  },
  moto: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14,
    color: RED,
    letterSpacing: 1,
    marginTop: 10,
    fontStyle: 'italic',
  },
  loaderWrap: {
    position: 'absolute',
    bottom: '14%',
    width: 80,
  },
  loaderTrack: {
    height: 1,
    backgroundColor: GRID,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    backgroundColor: RED,
  },
  baseline: {
    position: 'absolute',
    bottom: '8%',
  },
  baselineText: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontSize: 11,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: GREY,
  },
})
