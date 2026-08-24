import type { LauncherApp } from '../../types'
import { RunningAppRow } from './RunningAppRow'

type RunningAppsListProps = { apps: LauncherApp[]; disabled: boolean; onOpen: (app: LauncherApp) => void; onStop: (appId: string) => void }

export function RunningAppsList({ apps, disabled, onOpen, onStop }: RunningAppsListProps) {
  if (!apps.length) return null
  return <section aria-labelledby="running-apps-heading" className="mt-8 rounded-panel border border-surface/80 bg-surface/60 p-5 shadow-panel backdrop-blur-xl sm:p-8"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-eyebrow font-extrabold uppercase tracking-eyebrow text-sea">Now running</p><h2 id="running-apps-heading" className="mt-1 text-xl font-bold tracking-title text-ink">Your apps</h2></div><p className="text-xs font-semibold text-muted">Swipe right to stop</p></div><div className="space-y-2">{apps.map(app => <RunningAppRow key={app.id} app={app} disabled={disabled} onOpen={onOpen} onStop={onStop} />)}</div></section>
}
