import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function ExperienceIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...iconAttributes} {...props}><path d="M10 15h28v24H10z" /><path d="M18 15v-4h12v4M10 23h28M20 23v4h8v-4" /></svg>
}
