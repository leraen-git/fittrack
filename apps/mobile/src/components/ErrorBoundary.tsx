import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { withTranslation, type WithTranslation } from 'react-i18next'
import { colors as tokenColors } from '@/theme/tokens'

interface Props extends WithTranslation {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught:', error, info.componentStack)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const { t } = this.props
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{t('common.errorOccurred')}</Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.detail}>{this.state.error.message}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityLabel={t('common.retry')}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryInner)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokenColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: tokenColors.white,
    letterSpacing: 2,
    marginBottom: 12,
  },
  detail: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 13,
    color: tokenColors.dark.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: tokenColors.dark.primary,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 16,
    color: tokenColors.white,
    letterSpacing: 1,
  },
})
