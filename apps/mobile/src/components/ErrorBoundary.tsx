import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
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
      return (
        <View style={styles.container}>
          <Text style={styles.title}>UNE ERREUR EST SURVENUE</Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.detail}>{this.state.error.message}</Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityLabel="Réessayer"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>RÉESSAYER</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 12,
  },
  detail: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF2D3F',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
})
