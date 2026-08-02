import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function NourishIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...iconAttributes} {...props}><path d="M24 40V20" /><path d="M24 25C13 25 9 18 10 9c9-1 15 3 16 12M24 30c11 0 15-7 14-16-8-1-14 3-14 12" /><path d="M15 40h18" /></svg>
}
