import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...iconAttributes} {...props}><path d="m9 18 6-6-6-6" /></svg>
}
