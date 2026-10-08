import type { SVGProps } from 'react'
import { LOGO_DRAWING } from '../../shared/constants'

const { viewBox, badge, paper, lines, line, check, colors } = LOGO_DRAWING

export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" {...props}>
      <rect width={badge.size} height={badge.size} rx={badge.rx} fill={colors.badge} />
      <path d={paper} fill={colors.paper} />
      {lines.map(({ x, y, width, highlight }) => (
        <rect key={y} x={x} y={y} width={width} height={line.height} rx={line.rx} fill={highlight ? colors.highlight : colors.badge} opacity={highlight ? 1 : line.opacity} />
      ))}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={check.d} stroke={colors.badge} strokeWidth={check.outline} />
        <path d={check.d} stroke={colors.check} strokeWidth={check.width} />
      </g>
    </svg>
  )
}
