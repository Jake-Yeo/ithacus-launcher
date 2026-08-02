import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function StopIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...iconAttributes} {...props}><rect x="7" y="7" width="10" height="10" rx="2" /></svg>
}
