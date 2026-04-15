import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/theme/ThemeContext'
import { router } from 'expo-router'

export default function SignInScreen() {
  const { colors, typography, spacing } = useTheme()
  const { signInWithApple, status } = useAuth()
  const [loading, setLoading] = useState(false)

  // Already authenticated — go to main app
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/(tabs)/' as any)
    }
  }, [status])

  async function handleAppleSignIn() {
    setLoading(true)
    try {
      await signInWithApple()
      // AuthGate in _layout.tsx will navigate to the main app
    } catch (err: any) {
      // ERR_CANCELED means the user dismissed the sheet — silent
      if (err?.code !== 'ERR_CANCELED') {
        Alert.alert('Sign-in failed', 'Could not complete sign-in. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo / hero area */}
      <View style={styles.hero}>
        <Text
          style={[
            styles.logo,
            { color: colors.primary, fontFamily: typography.family.extraBold },
          ]}
          accessibilityRole="header"
        >
          FitTrack
        </Text>
        <Text
          style={[
            styles.tagline,
            { color: colors.textMuted, fontFamily: typography.family.regular, fontSize: typography.size.base },
          ]}
        >
          Track every rep. Own every PR.
        </Text>
      </View>

      {/* Auth area */}
      <View style={[styles.authArea, { paddingHorizontal: spacing.lg }]}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : Platform.OS === 'ios' ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={
              colors.background === '#0E0E0E'
                ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        ) : (
          // Android / dev fallback — shown only when Apple Sign-In is unavailable
          <Text
            style={[styles.fallback, { color: colors.textMuted, fontFamily: typography.family.regular }]}
          >
            Sign-in is available on iOS only.
          </Text>
        )}

        <Text
          style={[
            styles.legal,
            { color: colors.textMuted, fontFamily: typography.family.regular, fontSize: typography.size.xs },
          ]}
        >
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 48,
    letterSpacing: -1,
  },
  tagline: {
    textAlign: 'center',
  },
  authArea: {
    gap: 20,
    alignItems: 'center',
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  fallback: {
    textAlign: 'center',
  },
  legal: {
    textAlign: 'center',
    lineHeight: 18,
  },
})
