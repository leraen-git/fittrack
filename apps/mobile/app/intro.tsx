import { useEffect, useRef } from 'react'
import { View, Text, Pressable, Animated, Easing, StyleSheet, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useNavigation } from 'expo-router'
import { useIntroSeen } from '../src/hooks/useIntroSeen'

const TOKENS = {
  dark: {
    bg: '#000000',
    text: '#FFFFFF',
    textDim: 'rgba(255,255,255,0.92)',
    textMute: 'rgba(255,255,255,0.5)',
    textGhost: 'rgba(255,255,255,0.4)',
    accent: '#FF2D3F',
  },
  light: {
    bg: '#FFFFFF',
    text: '#000000',
    textDim: 'rgba(0,0,0,0.85)',
    textMute: 'rgba(0,0,0,0.55)',
    textGhost: 'rgba(0,0,0,0.45)',
    accent: '#E8192C',
  },
}

export default function IntroScreen() {
  const scheme = useColorScheme()
  const t = scheme === 'light' ? TOKENS.light : TOKENS.dark
  const navigation = useNavigation()
  const { markSeen } = useIntroSeen()

  const kanjiOpacity = useRef(new Animated.Value(0)).current
  const romajiOpacity = useRef(new Animated.Value(0)).current
  const quoteOpacity = useRef(new Animated.Value(0)).current
  const ctaOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(kanjiOpacity, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(romajiOpacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(quoteOpacity, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(ctaOpacity, { toValue: 1, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start()
  }, [])

  const finish = () => {
    markSeen()
    if (navigation.canGoBack()) {
      router.back()
    } else {
      router.replace('/onboarding/step0')
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />

      {/* Vignette */}
      <View style={[styles.vignette, { backgroundColor: t.accent, opacity: scheme === 'light' ? 0.04 : 0.07 }]} pointerEvents="none" />

      {/* Background glyph */}
      <Text
        style={[styles.glyphBg, { color: t.accent, opacity: scheme === 'light' ? 0.05 : 0.04 }]}
        pointerEvents="none"
      >
        鍛
      </Text>

      {/* Skip */}
      <Pressable
        onPress={finish}
        hitSlop={12}
        style={styles.skipBtn}
        accessibilityRole="button"
        accessibilityLabel="Passer l'introduction"
      >
        <Text style={[styles.skipText, { color: t.textGhost }]}>Passer</Text>
      </Pressable>

      {/* Kanji */}
      <Animated.Text
        style={[styles.kanjiPair, { color: t.accent, opacity: kanjiOpacity }]}
        accessibilityLabel="Tanren, écrit en kanji japonais"
      >
        鍛 錬
      </Animated.Text>

      {/* Romaji */}
      <Animated.Text style={[styles.romaji, { color: t.textMute, opacity: romajiOpacity }]}>
        TAN · REN
      </Animated.Text>

      {/* Divider */}
      <Animated.View style={[styles.divider, { backgroundColor: t.accent, opacity: romajiOpacity }]} />

      {/* Quote */}
      <Animated.Text style={[styles.quote, { color: t.textDim, opacity: quoteOpacity }]}>
        L'acier ne devient lame qu'après{' '}
        <Text style={{ color: t.accent, fontStyle: 'normal', fontWeight: '500' }}>
          mille coups de marteau
        </Text>
        .
      </Animated.Text>

      {/* Attribution */}
      <Animated.Text style={[styles.attribution, { color: t.textGhost, opacity: quoteOpacity }]}>
        — proverbe forgeron japonais
      </Animated.Text>

      {/* CTA */}
      <Animated.View style={[styles.ctaWrapper, { opacity: ctaOpacity }]}>
        <Pressable
          onPress={finish}
          accessibilityRole="button"
          accessibilityLabel="Commencer Tanren"
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: t.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.ctaText}>Commencer</Text>
        </Pressable>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  vignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  glyphBg: {
    position: 'absolute',
    right: -30,
    bottom: 100,
    fontFamily: 'NotoSerifJP_900Black_subset',
    fontWeight: '900',
    fontSize: 240,
    lineHeight: 240,
    letterSpacing: -10,
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    paddingVertical: 4,
    paddingHorizontal: 4,
    zIndex: 5,
  },
  skipText: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontWeight: '500',
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  kanjiPair: {
    fontFamily: 'NotoSerifJP_900Black_subset',
    fontWeight: '900',
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -1.2,
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 14,
  },
  romaji: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: 5.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 32,
    paddingLeft: 5,
  },
  divider: {
    width: 32,
    height: 1,
    alignSelf: 'center',
    marginBottom: 24,
  },
  quote: {
    fontFamily: 'BarlowCondensed_300Light',
    fontStyle: 'italic',
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    paddingHorizontal: 4,
    marginBottom: 14,
  },
  attribution: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontWeight: '500',
    fontSize: 10,
    letterSpacing: 3.2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  ctaWrapper: {
    marginTop: 'auto',
  },
  ctaBtn: {
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2.16,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
})
