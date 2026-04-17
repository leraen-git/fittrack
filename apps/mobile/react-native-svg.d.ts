// react-native-svg class components are incompatible with @types/react 19's
// stricter JSX element type checks. This override re-declares all used exports
// as functional ComponentType to satisfy the type checker.
// Track: https://github.com/software-mansion/react-native-svg/issues/2109

declare module 'react-native-svg' {
  import type { ComponentType, PropsWithChildren } from 'react'
  import type {
    SvgProps as _SvgProps,
    CircleProps as _CircleProps,
    RectProps as _RectProps,
    PathProps as _PathProps,
    LineProps as _LineProps,
    RadialGradientProps as _RadialGradientProps,
    StopProps as _StopProps,
  } from 'react-native-svg/lib/typescript/ReactNativeSVG'

  export type SvgProps = _SvgProps
  export type CircleProps = _CircleProps
  export type RectProps = _RectProps
  export type PathProps = _PathProps
  export type LineProps = _LineProps
  export type RadialGradientProps = _RadialGradientProps
  export type StopProps = _StopProps

  declare const Svg: ComponentType<SvgProps>
  declare const Circle: ComponentType<CircleProps>
  declare const Rect: ComponentType<RectProps>
  declare const Path: ComponentType<PathProps>
  declare const Line: ComponentType<LineProps>
  declare const Defs: ComponentType<PropsWithChildren>
  declare const RadialGradient: ComponentType<RadialGradientProps>
  declare const Stop: ComponentType<StopProps>

  export { Svg, Circle, Rect, Path, Line, Defs, RadialGradient, Stop }
  export default Svg
}
