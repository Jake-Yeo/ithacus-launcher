import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function DefaultAppIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...iconAttributes} {...props}><rect x="9" y="9" width="30" height="30" rx="8" /><circle cx="24" cy="24" r="5" /></svg>
}
