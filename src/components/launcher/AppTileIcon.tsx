import type { LauncherApp } from '../../types'
import { appVisuals, defaultAppVisual } from '../../config/appVisuals'
import { cn } from '../../lib/cn'

export function AppTileIcon({ app }: { app: LauncherApp }) {
  const appVisual = appVisuals[app.id as keyof typeof appVisuals] || defaultAppVisual
  const Icon = appVisual.icon
  return <span className={cn('relative mx-auto grid aspect-square w-full max-w-36 place-items-center overflow-hidden rounded-app bg-gradient-to-br text-surface shadow-app transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-app-hover group-active:scale-95 motion-reduce:transition-none', appVisual.gradient)}>
    <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-surface/15 to-transparent" />
    <Icon className="relative size-icon-art" />
    {app.state !== 'stopped' && <span className="absolute right-2.5 top-2.5 size-3 rounded-full border-2 border-surface/90 bg-running-indicator shadow-sm" aria-label={app.state} />}
  </span>
}
