import type { SVGProps } from 'react'
import { iconAttributes } from './iconAttributes'

export function PortfolioIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" {...iconAttributes} {...props}><circle cx="24" cy="17" r="7" /><path d="M11 39c1.8-8.2 6.1-12.3 13-12.3S35.2 30.8 37 39" /><path d="M10 9h28v30H10z" opacity=".28" /></svg>
}
