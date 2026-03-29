export const colors = {
  white: '#FFFFFF' as const,
  light: {
    primary: '#E8192C',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    surface2: '#EBEBEB',
    textPrimary: '#0E0E0E',
    textMuted: '#888888',
  },
  dark: {
    primary: '#FF2D3F',
    background: '#0E0E0E',
    surface: '#1A1A1A',
    surface2: '#252525',
    textPrimary: '#F0F0F0',
    textMuted: '#555555',
  },
  shared: {
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#E8192C',
  },
  heatmap: ['#141414', '#4A0A10', '#8A1520', '#C01E2E', '#FF2D3F'],
} as const

export const typography = {
  family: {
    regular: 'Inter_400Regular',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
  },
  size: {
    xs: 10,
    sm: 11,
    md: 12,
    base: 13,
    body: 14,
    title: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
} as const
