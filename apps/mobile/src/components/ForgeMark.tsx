import React from 'react'
import Svg, { Circle, Rect, Line } from 'react-native-svg'
import { colors as tokenColors } from '@/theme/tokens'

interface Props {
  size?: number
  isDark?: boolean
}

export function ForgeMark({ size = 64, isDark = true }: Props) {
  const stroke = isDark ? tokenColors.white : tokenColors.black
  const fill = isDark ? tokenColors.white : tokenColors.black
  const red = isDark ? tokenColors.dark.primary : tokenColors.light.primary

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx={100} cy={100} r={72} fill="none" stroke={stroke} strokeWidth={6} />
      <Circle cx={100} cy={100} r={14} fill={red} />
      <Rect x={92} y={20} width={16} height={50} fill={fill} />
      <Rect x={20} y={92} width={50} height={16} fill={fill} />
      <Rect x={130} y={92} width={50} height={16} fill={fill} />
      <Rect x={92} y={130} width={16} height={50} fill={fill} />
      <Line x1={148} y1={52} x2={135} y2={65} stroke={red} strokeWidth={4} strokeLinecap="square" />
      <Line x1={52} y1={148} x2={65} y2={135} stroke={red} strokeWidth={4} strokeLinecap="square" />
    </Svg>
  )
}
