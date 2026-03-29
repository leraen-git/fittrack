import React, { createContext, useContext, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import { colors, typography, spacing, radius } from './tokens'

type ColorScheme = 'light' | 'dark'

type ThemeColors = {
  primary: string
  background: string
  surface: string
  surface2: string
  textPrimary: string
  textMuted: string
  success: string
  warning: string
  danger: string
}

interface Theme {
  colors: ThemeColors
  typography: typeof typography
  spacing: typeof spacing
  radius: typeof radius
  scheme: ColorScheme
  isDark: boolean
}

const ThemeContext = createContext<Theme | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = (useColorScheme() ?? 'dark') as ColorScheme
  const isDark = scheme === 'dark'

  const theme: Theme = {
    colors: {
      ...(isDark ? colors.dark : colors.light),
      ...colors.shared,
    },
    typography,
    spacing,
    radius,
    scheme,
    isDark,
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
