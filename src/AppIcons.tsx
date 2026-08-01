import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const shared = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function PortfolioIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...shared} {...props}><circle cx="24" cy="17" r="7" /><path d="M11 39c1.8-8.2 6.1-12.3 13-12.3S35.2 30.8 37 39" /><path d="M10 9h28v30H10z" opacity=".28" /></svg>
}

export function ExperienceIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...shared} {...props}><path d="M10 15h28v24H10z" /><path d="M18 15v-4h12v4M10 23h28M20 23v4h8v-4" /></svg>
}

export function CallumployedIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...shared} {...props}><path d="M14 8h20v32H14z" /><path d="M19 15h10M19 21h10M19 27h7M19 34h10" /><path d="m29 29 3 3 6-7" /></svg>
}

export function NourishIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...shared} {...props}><path d="M24 40V20" /><path d="M24 25C13 25 9 18 10 9c9-1 15 3 16 12M24 30c11 0 15-7 14-16-8-1-14 3-14 12" /><path d="M15 40h18" /></svg>
}

export function DefaultAppIcon(props: IconProps) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...shared} {...props}><rect x="9" y="9" width="30" height="30" rx="8" /><circle cx="24" cy="24" r="5" /></svg>
}

export function ArrowIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><path d="m9 18 6-6-6-6" /></svg>
}

export function StopIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...shared} {...props}><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
}
